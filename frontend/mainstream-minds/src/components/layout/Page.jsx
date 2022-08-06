import { Box } from "@mui/material";

const Page = (props) => {
<<<<<<< Updated upstream
  
    return (
      <Box sx={{ ml: 10, mt: 10 }}>
=======
  const marginTop = props.mt || 60
  const padding = props.padding || ''
  const align = props.align || 'center'
  return (
    <Box sx={{ 
      ml: 10, 
      mt: {marginTop}, 
      mr: 10, 
      padding: `${padding}`,
      minWidth: '680px' 
      }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align
      }}>
>>>>>>> Stashed changes
        {props.children}
      </Box>
    )
  }
  
  export default Page;

