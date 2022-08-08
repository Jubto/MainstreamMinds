import {useState} from "react";
import useAuth from "../hooks/useAuth";
import useGlobal from "../hooks/useGlobal";
import useLocalStorage from "../hooks/useLocalStorage";
import msmLogin from "../api/msmLogin";
import {useNavigate, useLocation, Link} from 'react-router-dom';
import {Box, Button, Grid, TextField, Typography} from "@mui/material";
import LogInLogoPanel from "../components/account/LogInLogoPanel";

const LogInScreen = () => {
  const {setAuth} = useAuth();
  const context = useGlobal();
  const [, setAuthStored] = useLocalStorage('auth', '')
  const [errorMsg, setErrorMsg] = useState(null)

  const [formErrors, setFormErrors] = useState({
    error: false,
    email: null,
    password: null,
  })

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    formErrors.error = false;

    if (!/^[\w]+(\.?[\w]+)*@[\w]+\.[a-zA-Z]+$/.test(email)) {
      setFormErrors(prevState => {
        return {...prevState, email: true}
      })
      formErrors.error = true
    }
    if (password.length < 8) {
      setFormErrors(prevState => {
        return {...prevState, password: true}
      })
      formErrors.error = true
    }

    if (!formErrors.error) {
      try {
        setErrorMsg(null)
        const formParams = new URLSearchParams(); // backend requires form data, not json data
        formParams.append('username', email); // temp note: backend OAUTH form maps username to email
        formParams.append('password', password);
        const resLogin = await msmLogin.post('/users/login', formParams);
        const currentUserProfile = await msmLogin.get('/users/me', {headers: {Authorization: `Bearer ${resLogin.data.access_token}`}});
        setAuth({accessToken: resLogin.data.access_token, role: currentUserProfile.data.role});
        setAuthStored({accessToken: resLogin.data.access_token, role: currentUserProfile.data.role})
        if (location.state?.redirect) {
          navigate(from, { state: { redirect: location.state.redirect } })
        }
        else {
          navigate(from, { replace: true });
        }

      } catch (err) {
        if (err.response?.status === 401) {
          console.log("HERE ERIN")
          setErrorMsg(err.response.data.detail)
        }
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
          <br/>
          <TextField
            autoFocus
            required
            name="email"
            label="Email"
            placeholder="Email"
            fullWidth
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
            fullWidth
            error={formErrors.password}
            onChange={() => {
              formErrors.password && setFormErrors(prevState => {
                return {...prevState, password: false}
              })
            }}
            sx={{mt: 3}}
            helperText={formErrors.password ? 'Password must be at least 8 characters long' : ''}
          />
          <br/>

          <Box sx={{width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 3}}>
            <Typography variant='body3' sx={{color: 'rgba(0,0,0,0.6)', pr: 2}}>Don't have an account? <Link
              sx={{ml: 1}} to="/sign-up">Sign Up</Link></Typography>
          </Box>

          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Button variant='contained' type='submit' sx={{mt: 5, width: '80%'}}>
              LOG IN
            </Button>
          </Box>

          <Typography variant='subtitle1' sx={{color: 'error.main', mt: 2, fontWeight: 500}}>
            {errorMsg}
          </Typography>

        </Box>
      </Grid>
    </Grid>
  );
}

export default LogInScreen
