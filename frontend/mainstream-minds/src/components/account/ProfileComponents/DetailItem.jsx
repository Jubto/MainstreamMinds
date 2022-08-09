import { Typography } from '@mui/material';
import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

const EditableDetailItem = (props) => {
    const label = props.label;
    const info = props.info;
    const icon = props.icon;
    const route= props.route || 'testroute';
    return (
        <ListItem
                  secondaryAction={
                    <Typography variant="caption" edge="end" aria-label="edit" onClick={route}>
                    <IconButton >
                      <EditIcon />
                    </IconButton>
                     Edit
                    </Typography>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      {icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={label}
                    secondary={info}
                  />
                </ListItem>
    )
}
const DetailItem = (props) => {
  const label = props.label;
  const info = props.info;
  const icon = props.icon;
  const route= props.route || 'testroute';
  return (
      <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    {icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={label}
                  secondary={info}
                />
              </ListItem>
  )
}

export {EditableDetailItem};
export {DetailItem}
