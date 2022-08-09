import Stack from '@mui/material/Stack';
import SelectedChip from './SelectedChip';

const SelectedTagStack = (props) => {
  const tags = props.tags;

  return(
    <Stack direction="row" spacing={1} sx={{ overflow: 'auto'}}>
      {tags && tags.length!==0 && tags.map((str) => {
        //console.log("name",str)
        return(<SelectedChip name={str} />)
      })}
    </Stack>
  )
}

export default SelectedTagStack