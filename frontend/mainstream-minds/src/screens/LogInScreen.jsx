import {useState} from "react";
import useAuth from "../hooks/useAuth";
import useGlobal from "../hooks/useGlobal";
import msmLogin from "../api/msmLogin";
import {useNavigate, useLocation, Link} from 'react-router-dom';
import {Box, Button, Grid, TextField, Typography} from "@mui/material";
import LogInLogoPanel from "../components/account/LogInLogoPanel";

const LogInScreen = () => {
  const {setAuth} = useAuth();
  const context = useGlobal();
  const [, setAccount] = context.account;
  const [errorMsg, setErrorMsg] = useState(null)

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');

    if ('no errors') {
      try {
        setErrorMsg(null)
        const formParams = new URLSearchParams(); // backend requires form data, not json data
        formParams.append('username', email); // temp note: backend OAUTH form maps username to email
        formParams.append('password', password);
        const resLogin = await msmLogin.post('/users/login', formParams);
        setAuth({accessToken: resLogin.data.access_token, role: 0}); // globally sets auth, note: temporarily leaving role: 0 (remove once /api/user/me endpoint exists)
        // TODO backend set up /api/user/me endpoint, send valid jwt, returns user details + role
        navigate(from, {replace: true});
      } catch (err) {
        if (err.response?.status === 401) {
          setErrorMsg(err.response.data.detail)
        }
      }
    }
  }

  return (
    <Grid container sx={{height: '100vh', width: '100vw'}} columns={10}>
      <Grid item xs={6}>
        <LogInLogoPanel />
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
            name="email"
            label="Email"
            placeholder="Email"
            sx={{width: '100%'}}
          />
          <TextField
            required
            type="password"
            name="password"
            label="Password"
            placeholder="Password"
            sx={{mt: 3, width: '100%'}}
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

          <Typography variant='subtitle1' sx={{color: 'error.main', mt: 2, fontWeight: 1000}}>
            {errorMsg}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

export default LogInScreen
