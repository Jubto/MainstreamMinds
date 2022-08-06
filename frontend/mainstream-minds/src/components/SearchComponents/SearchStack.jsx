import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import SearchChip from './SearchChip';

const SearchStack = (props) => {
  const tags = props.tags;
  const selected = []
  
  return (
    <Stack direction="row" spacing={1} sx={{width: '40vw', overflow: 'auto'}}>
      {tags && tags.length!==0 && tags.map((value) => (
          <SearchChip name={value.name}/>
        ))
      }
    </Stack>
  )
}

export default SearchStack;