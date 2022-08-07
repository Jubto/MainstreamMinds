import {useState} from "react";
import useAuth from "../hooks/useAuth";
import useGlobal from "../hooks/useGlobal";
import msmLogin from "../api/msmLogin";
import msmAPI from "../api/msmAPI";
import {useNavigate, useLocation, Link} from 'react-router-dom';
import {Box, Button, Grid, TextField, Typography} from "@mui/material";
import LogInLogoPanel from "../components/account/LogInLogoPanel";


const SignUpScreen = () => {
  const {setAuth} = useAuth();
  const context = useGlobal();
  const [, setAccount] = context.account;
  const [errorMsg, setErrorMsg] = useState(null)

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [formErrors, setFormErrors] = useState({
    error: false,
    firstName: null,
    lastName: null,
    email: null,
    password: null,
  })

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const firstName = data.get('firstName');
    const lastName = data.get('lastName');
    const email = data.get('email');
    const password = data.get('password');

    formErrors.error = false;

    if (!/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(firstName)) {
      setFormErrors(prevState => {
        return {...prevState, firstName: true}
      })
      formErrors.error = true
    }
    if (!/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(lastName)) {
      setFormErrors(prevState => {
        return {...prevState, lastName: true}
      })
      formErrors.error = true
    }

    if (!/^[\w]+(\.?[\w]+)*@[\w]+\.[a-zA-Z]+$/.test(email)) {
      setFormErrors(prevState => {
        return {...prevState, email: true}
      })
      formErrors.error = true
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password) || password.length < 8) {
      setFormErrors(prevState => {
        return {...prevState, password: true}
      })
      formErrors.error = true
    }

    if (!formErrors.error) {
      setErrorMsg(null)
      try {
        const body = {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password
        }
        const resReg = await msmAPI.post('/users/register', body);
        // Registration success - login with details
        const formParams = new URLSearchParams();
        formParams.append('username', email);
        formParams.append('password', password);
        const resLogin = await msmLogin.post('/users/login', formParams);
        setAuth({accessToken: resLogin.data.access_token, role: 0}); // temp role
        navigate(from, {replace: true});
      } catch (err) {
        if (err.response?.status === 409) {
          console.log(err) // email has to be unique, backend currently crashes if not
        }
        console.error(err)
        setErrorMsg('Email already exists in the database.') // currently DB does not return HTTP_409_CONFLICT
      }
    }
  }

  return (
    <Grid container sx={{height: '100vh', width: '100vw'}} columns={10}>
      <Grid item xs={6}>
        <LogInLogoPanel/>
      </Grid>
      <Grid item xs={4}>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ml: 10, mt: 10, mr: 10}}>
          <Typography variant='h2' sx={{color: '#0E4DA4', fontWeight: 600}}>Welcome!</Typography>
          <Typography variant='subtitle1'>Ready to connect with the latest developments in research?</Typography>
          <Typography variant='subtitle1'>Create a new <Box component={'span'}>account today</Box>!</Typography>
          <br/>
          <TextField
            autoFocus
            required
            name="firstName"
            label="First Name"
            placeholder="First Name"
            sx={{width: '100%'}}
            onChange={() => {
              formErrors.firstName && setFormErrors(prevState => {
                return {...prevState, firstName: false}
              })
            }}
            error={formErrors.firstName}
            helperText={formErrors.firstName ? 'Must be a valid firstname.' : ''}
          />
          <TextField
            required
            name="lastName"
            label="Last Name"
            placeholder="Last Name"
            sx={{mt: 3, width: '100%'}}
            onChange={() => {
              formErrors.lastName && setFormErrors(prevState => {
                return {...prevState, lastName: false}
              })
            }}
            error={formErrors.lastName}
            helperText={formErrors.lastName ? 'Must be a valid lastname.' : ''}
          />
          <TextField
            required
            name="email"
            label="Email"
            placeholder="Email"
            sx={{mt: 3, width: '100%'}}
            onChange={() => {
              formErrors.email && setFormErrors(prevState => {
                return {...prevState, email: false}
              })
            }}
            error={formErrors.email}
            helperText={formErrors.email ? 'Invalid email.' : ''}
          />
          <TextField
            required
            type="password"
            name="password"
            label="Password"
            placeholder="Password"
            sx={{mt: 3, width: '100%'}}
            error={formErrors.password}
            onChange={() => {
              formErrors.password && setFormErrors(prevState => {
                return {...prevState, password: false}
              })
            }}
            helperText={formErrors.password ? 'Password must be at least 8 characters long and contain 1 lower case, 1 upper case, 1 number and one special character' : ''}
          />
          <br/>

          <Box sx={{width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 3}}>
            <Typography variant='body3' sx={{color: 'rgba(0,0,0,0.6)', pr: 2}}>Already have an account? <Link
              sx={{ml: 1}} to="/login">Log In</Link></Typography>
          </Box>

          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Button variant='contained' type='submit' sx={{mt: 5, width: '80%'}}>
              SIGN UP
            </Button>
          </Box>

          <Typography variant='subtitle1' sx={{color: 'error.main', mt: 2, fontWeight: 1000}}>
            {errorMsg}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

export default SignUpScreen
