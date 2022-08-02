import * as React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const Tags = (props) => {
  const tags = props.tags;
  const handleClick = () => {
    console.info('You clicked the Chip.');
  };
  const colours = [
    '1BB55C', 
    'FF9800', 
    '1976D2', 
    '9747FF', 
    'FF6363', 
    '009688', 
    '3F51B5', 
    'FFD600', 
    'FF4081', 
    '795548', 
    '607D8B', 
    '00BCD4'
  ]

  const randomColour = () => {
    const chosenColour = colours[Math.floor(Math.random() * colours.length)]
    return `#${chosenColour}`
  }

  return (
    <Stack direction="row" spacing={1} sx={{padding: '12px 0', overflow: 'auto'}}>
      {tags && tags.length!==0 && tags.map((value) => (
          <Chip 
            key={value.name}
            label={value.name}
            onClick={handleClick} 
            sx={{ bgcolor: randomColour(), color: 'white'}}
            size="small"
          />
        ))
      }
      <Chip 
        label="Placeholder" 
        onClick={handleClick}
        sx={{ bgcolor: randomColour(), color: 'white'}}
        size="small" 
      />
    </Stack>
  );
}

export default Tags;