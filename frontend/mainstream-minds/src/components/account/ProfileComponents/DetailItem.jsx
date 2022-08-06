import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EditIcon from '@mui/icons-material/Edit';

const DetailItem = (props) => {
    const label = props.label;
    const info = props.info;
    const icon = props.icon;
    return (
        <ListItem
                  secondaryAction={
                    <Typography variant="caption" edge="end" aria-label="edit">
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

export default DetailItem;