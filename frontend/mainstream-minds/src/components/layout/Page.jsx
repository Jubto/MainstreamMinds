import { Box } from "@mui/material";

const Page = (props) => {
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
        alignItems: `${align}`
      }}>
        {props.children}
      </Box>
    </Box>
  )
}

export default Page;

