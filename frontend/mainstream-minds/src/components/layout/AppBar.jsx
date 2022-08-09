import { useEffect, useState } from "react";
import {AppBar as MuiAppBar} from "@mui/material"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import usePersistentAuth from "../../hooks/usePersistentAuth";
import Button from '@mui/material/Button';
import ToolTip from '@mui/material/Tooltip';
import { Link, useLocation, useNavigate } from "react-router-dom";
import Toolbar from '@mui/material/Toolbar';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import useAuth from "../../hooks/useAuth";


const AppBar = (props) => {
  const [storedAuth, setPersistentAuth] = usePersistentAuth('auth', '')
  const {auth, setAuth} = useAuth();
  const navigate = useNavigate()
  const location = useLocation();
  const [loggedOut, setLoggedOut] = useState(false)
  const hideForRoutes = props.hideForRoutes;

  const guest = (
    <ToolTip title="login" enterDelay={10}>
    <IconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label="menu"
      sx={{mr: 2}}
      component={Link}
      to={'/login'}
      onClick={() => setLoggedOut(false)}
      state={{ from: location }}
      >
          <LoginIcon/>
    </IconButton>
    </ToolTip>
  );

  const loggedIn = (
    <>
      <Button color="inherit" component={Link} to={'/account'} state={{ from: location }} style={{ marginRight: 32 }}>PROFILE</Button>
      <ToolTip title="logout" enterDelay={10}>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={() => {
          if (!storedAuth || storedAuth === 'LOGOUT_PING') {
            setPersistentAuth('LOGOUT_PONG')
          }
          else if (!storedAuth || storedAuth === 'LOGOUT_PONG') {
            setPersistentAuth('LOGOUT_PING')
          }
          else if (storedAuth.accessToken) {
            setPersistentAuth('')
          }
          setLoggedOut(true)
          setAuth({})
        }}
        >
            <LogoutIcon/>
      </IconButton>
      </ToolTip>
    </>
  );

  useEffect(() => {
    // to ensure usePersistentAuth has had time to set storedAuth before redirect
    if ((storedAuth === 'LOGOUT_PING' || storedAuth === 'LOGOUT_PONG') && loggedOut) {
      navigate('/')
    }
  }, [storedAuth, loggedOut])

  // Don't show app bar if location in hideForRoutes
  if (hideForRoutes.includes(location.pathname)) {
    return;
  }

  return (
    <Box sx={{flexGrow: 1}}>
      <MuiAppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{flexGrow: 1, textDecoration: 'none', color: 'white'}} component={Link} to={'/'}
                      state={{from: location}}>
            Mainstream Minds
          </Typography>
          <Button color="inherit" component={Link} to={'/'} state={{from: location}}
                  sx={{marginRight: 4}}>DISCOVER</Button>
          <Button color="inherit" component={Link} to={'/search'} state={{from: location}}
                  sx={{marginRight: 4}}>SEARCH</Button>
          {auth.accessToken ? loggedIn : guest}
        </Toolbar>
      </MuiAppBar>
    </Box>
  );
}

export default AppBar;
