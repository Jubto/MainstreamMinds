import { Box } from "@mui/material";

const Page = (props) => {
  
    return (
      <Box sx={{ ml: 10, mt: 10 }}>
        {props.children}
      </Box>
    )
  }
  
  export default Page;

