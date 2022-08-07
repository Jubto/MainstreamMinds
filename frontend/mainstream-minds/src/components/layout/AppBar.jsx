import {AppBar as MuiAppBar} from "@mui/material"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {Link, useLocation} from "react-router-dom";
import Toolbar from '@mui/material/Toolbar';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import useAuth from "../../hooks/useAuth";


const AppBar = (props) => {
  const location = useLocation();
  const {auth, setAuth} = useAuth();
  const hideForRoutes = props.hideForRoutes;

  const guest = (
    <IconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label="menu"
      sx={{mr: 2}}
      component={Link}
      to={'/login'}
      state={{from: location}}
    >
      <LoginIcon/>
    </IconButton>
  );

  const loggedIn = (
    <>
      <Button color="inherit" component={Link} to={'/account'} state={{from: location}}
              style={{marginRight: 32}}>PROFILE</Button>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{mr: 2}}
        onClick={() => setAuth({})}
      >
        <LogoutIcon/>
      </IconButton>
    </>
  );

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
