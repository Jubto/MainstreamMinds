import {useState} from "react";
import useAuth from "../hooks/useAuth";
import useGlobal from "../hooks/useGlobal";
import msmLogin from "../api/msmLogin";
import {useNavigate, useLocation} from 'react-router-dom';
import {Box, Button, Grid, Link, TextField, Typography} from "@mui/material";

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
        <Box sx={{background: '#1976D2', width: '100%', height: '100%'}}>
          <img src={process.env.PUBLIC_URL + '/lightbulb.png'} alt={'Logo'}/>
          <Typography variant='h1' sx={{color: 'white'}}>MAINSTREAM</Typography>
          <Typography variant='h1' sx={{color: 'white'}}>MINDS</Typography>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ml: 10, mt: 10}}>
          <Typography variant='h3'>Welcome!</Typography>
          <Typography variant='subtitle1'>Ready to connect with the latest developments in research?</Typography>
          <Typography variant='subtitle1'>Create a new <Link>account today</Link>!</Typography>
          <br/>
          <TextField
            autoFocus
            required
            name="email"
            label="Account email"
            sx={{mr: 2}}
          />
          <TextField
            required
            type="password"
            name="password"
            label="password"
          />
          <br/>
          <Button variant='contained' type='submit' sx={{mt: 2}}>
            Log in
          </Button>
          <Typography variant='subtitle1' sx={{color: 'error.main', mt: 2, fontWeight: 1000}}>
            {errorMsg}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ml: 10, mt: 10}}>
      <Typography variant='h5'>
        LogInScreen
      </Typography>
      <br/>
      <TextField
        autoFocus
        required
        name="email"
        label="Account email"
        sx={{mr: 2}}
      />
      <TextField
        required
        type="password"
        name="password"
        label="password"
      />
      <br/>
      <Button variant='contained' type='submit' sx={{mt: 2}}>
        Log in
      </Button>
      <Typography variant='subtitle1' sx={{color: 'error.main', mt: 2, fontWeight: 1000}}>
        {errorMsg}
      </Typography>
    </Box>
  )
}

export default LogInScreen
