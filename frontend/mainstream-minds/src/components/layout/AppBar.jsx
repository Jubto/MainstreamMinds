import { AppBar as MuiAppBar } from "@mui/material"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import LoginIcon from '@mui/icons-material/Login';


const AppBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
        <MuiAppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Mainstream Minds
          </Typography>
          <Button color="inherit">DISCOVER</Button>
          <Button color="inherit">SEARCH</Button>
          {/* <Button color="inherit">PROFILE</Button> */}
          <LoginIcon/>
        </Toolbar>
        </MuiAppBar>
    </Box>
    )
}

export default AppBar;