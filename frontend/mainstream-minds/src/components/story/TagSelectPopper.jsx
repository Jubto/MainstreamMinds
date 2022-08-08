import { Popper } from "@mui/material"

const TagSelectPopper = (props) => {
  return (
    <Popper
      {...props}
      placement="bottom-start"
      sx={{
        '.MuiAutocomplete-paper': { height: '250px', overflow: 'hidden' },
      }}
    />
  );
}

export default TagSelectPopper