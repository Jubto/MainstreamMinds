import { Popper } from "@mui/material"

const TagSelectPopper = (props) => {
  return (
    <Popper
      {...props}
      placement="bottom-start"
    />
  );
}

export default TagSelectPopper