import { Box } from "@mui/material";

const Page = (props) => {
  const marginTop = props.mt || 60
  const padding = props.padding || ''

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
        alignItems: 'center'
      }}>
        {props.children}
      </Box>
    </Box>
  )
}

export default Page;

