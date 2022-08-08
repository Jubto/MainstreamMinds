import {Box, Typography} from "@mui/material";

const LogInLogoPanel = () => {

  return (
    <Box sx={{background: '#1976D2', width: '100%', height: '100%'}}>
      <Box sx={{
        height: '80%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <img src={process.env.PUBLIC_URL + '/lightbulb.png'} alt={'Logo'}/>
        <Box sx={{borderLeft: '5px solid white', pl: 3}}>
          <Typography variant='h1' sx={{color: 'white'}}><Box component={'span'} sx={{fontSize: '150%'}}>M</Box>AINSTREAM</Typography>
          <Typography variant='h1' sx={{color: 'white'}}><Box component={'span'} sx={{fontSize: '150%'}}>M</Box>INDS</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default LogInLogoPanel
