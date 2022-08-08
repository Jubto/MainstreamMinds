import Stack from '@mui/material/Stack';
import SearchChip from './SearchChip';

const SearchStack = (props) => {
  const tags = props.tags;
  const selected = [] // todo: persist selected tag style
  
  return (
    <Stack direction="row" spacing={1} sx={{ overflow: 'auto'}}>
      {tags && tags.length!==0 && tags.map((value) => (
          <SearchChip name={value.name}/>
        ))
      }
    </Stack>
  )
}

export default SearchStack;