import { Typography } from '@mui/material';
import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';



const DetailItem = (props) => {
    const label = props.label;
    const info = props.info;
    const icon = props.icon;
    const route= props.route || 'testroute';
    

   /* const testFn = async (event ) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget); //need to figure this out
        const email = data.get('email'); 
        const password = data.get('password');

    if ('no errors') {
      try {
        setErrorMsg(null)
        //ok so need to get existing user data incl. id
        //find a way to compare, figure out what is being updated?
        //OR: put these fns in their own file so i can call specific ones from acctdetails
        //probably the more reasonable soln
        const resUpdate = await msmLogin.patch('/users/{id}', formParams);
        setAuth({ accessToken: resLogin.data.access_token, role: 0 }); // globally sets auth, note: temporarily leaving role: 0 (remove once /api/user/me endpoint exists)
        // TODO backend set up /api/user/me endpoint, send valid jwt, returns user details + role
        navigate(from, { replace: true });
      }
      catch (err) {
        if (err.response?.status === 401) {
          console.log("HERE ERIN")
          setErrorMsg(err.response.data.detail)
        }
      }
    }
        console.log("clicked :D")
        console.log({route})
    }*/
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

export default DetailItem;