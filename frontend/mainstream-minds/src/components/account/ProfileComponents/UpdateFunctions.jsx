import { Typography } from '@mui/material';
import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

const UpdateName = (props) => {
    //To-Do
    return(
    console.log("Updating name")
    );
}

const UpdatePassword = (props) => {
    //To-Do
    console.log("Updating password")
}

const UpdateEmail = (props) => {
    //To-Do
    console.log("Updating email")
}

const DeleteAccount = (props) => {
    //To-Do
    console.log("Deleting account")

}

export {UpdateName};
export {UpdatePassword};
export {UpdateEmail};
export {DeleteAccount};
//kind of works, need to figure out how to export more than one though
//export {UpdateName, UpdatePassword, UpdateEmail};