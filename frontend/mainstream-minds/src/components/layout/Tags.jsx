import * as React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { randomColour } from '../styles/colours';
import { useNavigate } from 'react-router-dom';

const Tags = (props) => {
  const tags = props.tags;
  const tagSize = props.tagSize || ""
  const handleClick = (name) => {
    console.info('You clicked the Chip.', name);
    //props.passTag()
  };

  return (
    <Stack direction="row" spacing={1} sx={{padding: '12px 0', overflow: 'auto'}}>
      {tags && tags.length!==0 && tags.map((value) => (
          <Chip 
            key={value.name}
            label={value.name}
            onClick={() => handleClick(value.name)} 
            sx={{ bgcolor: randomColour(), color: 'white'}}
            size={tagSize}
          />
        ))
      }
    </Stack>
  );
}

export default Tags;