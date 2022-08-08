import * as React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { getColourForString } from '../styles/colours';
import { useNavigate } from 'react-router-dom';

const Tags = (props) => {
  const navigate = useNavigate()
  const tags = props.tags
  const tagSize = props.tagSize || ""
  const disable = props.disable || false

  const handleClick = (tagName) => {
    if (props.setUnSelect) {
      props.setUnSelect(tagName)
    }
    else if (!disable) {
      navigate(`/search?tags=${tagName}`)
    }
  }

  return (
    <Stack direction="row" spacing={1} sx={{ padding: '12px 0', overflow: 'hidden' }}>
      {tags && tags.length !== 0 && tags.map((tag) => {
        const tagName = tag?.name ? tag.name : tag
        return (
          <Chip
            key={tagName}
            label={tagName}
            onClick={() => handleClick(tagName)}
            sx={{ bgcolor: getColourForString(tagName), color: 'white' }}
            size={tagSize}
          />
        )
      }

      )
      }
    </Stack>
  );
}

export default Tags;