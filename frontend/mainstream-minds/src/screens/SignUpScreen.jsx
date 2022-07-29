import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useGlobal from "../hooks/useGlobal";
import msmLogin from "../api/msmLogin";
import msmAPI from "../api/msmAPI";
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, TextField, Typography } from "@mui/material";


const SignUpScreen = () => {
  const { setAuth } = useAuth();
  const context = useGlobal();
  const [, setAccount] = context.account;
  const [errorMsg, setErrorMsg] = useState(null)

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const firstName = data.get('firstName');
    const lastName = data.get('lastName');
    const email = data.get('email');
    const password = data.get('password');

    if ('no errors') {
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
        setAuth({ accessToken: resLogin.data.access_token, role: 0 }); // temp role
        navigate(from, { replace: true });
      }
      catch (err) {
        if (err.response?.status === 409) {
          console.log(err) // email has to be unique, backend currently crashes if not
        }
        console.error(err) 
        setErrorMsg('Email already exists in the database.') // currently DB does not return HTTP_409_CONFLICT
      }
    }
  }


  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ ml: 10, mt: 10 }}>
      <Typography variant='h5'>
        SignUpScreen
      </Typography>
      <br />
      <TextField
        autoFocus
        required
        name="firstName"
        label="firstName"
        sx={{ mr: 2, mb:2 }}
      />
      <TextField
        required
        name="lastName"
        label="lastName"
      />
      <br />
      <TextField
        autoFocus
        required
        name="email"
        label="Account email"
        sx={{ mr: 2 }}
      />
      <TextField
        required
        type="password"
        name="password"
        label="password"
      />
      <br />
      <Button variant='contained' type='submit' sx={{ mt: 2 }}>
        Sign Up
      </Button>
      <Typography variant='subtitle1' sx={{color: 'error.main', mt:2, fontWeight: 1000}}>
        {errorMsg}
      </Typography>
    </Box>
  )
}

export default SignUpScreen