import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const SearchStack = (props) => {
  const tags = props.tags;
  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  return (
    <Stack direction="row" spacing={1} sx={{width: '40vw', overflow: 'auto'}}>
      {tags && tags.length!==0 && tags.map((value) => (
          <Chip 
            key={value.name}
            label={value.name}
            onClick={handleClick} 
            /* activate on click onDelete={handleDelete} */
          />
        ))
      }
    </Stack>
  )
}

export default SearchStack;