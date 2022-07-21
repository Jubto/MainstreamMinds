import useAuth from "../hooks/useAuth";
import useGlobal from "../hooks/useGlobal";
import msmLogin from "../api/msmLogin";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, TextField, Typography } from "@mui/material";

const LogInScreen = () => {
  const { setAuth } = useAuth();
  const context = useGlobal();
  const [, setAccount] = context.account;

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
        const formParams = new URLSearchParams(); // backend requires form data, not json data
        formParams.append('username', email); // temp note: backend OAUTH form maps username to email
        formParams.append('password', password);
        const resLogin = await msmLogin.post('/users/login', formParams);
        setAuth({ accessToken: resLogin.data.access_token, role: 0 }); // globally sets auth, note: temporarily leaving role: 0 (remove once /api/user/me endpoint exists)
        // TODO backend set up /api/user/me endpoint, send valid jwt, returns user details + role
        navigate(from, { replace: true });
      }
      catch (err) {
        console.error(err)
      }
    }
  }

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ ml: 10, mt: 10 }}>
      <Typography variant='h5'>
        LogInScreen
      </Typography>
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
        Log in
      </Button>
    </Box>
  )
}

export default LogInScreen