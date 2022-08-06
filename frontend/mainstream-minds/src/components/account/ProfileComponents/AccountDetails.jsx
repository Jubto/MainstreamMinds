import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Grid from '@mui/material/Grid';
import PersonIcon from '@mui/icons-material/Person';
import PasswordIcon from '@mui/icons-material/Password';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DetailItem from './DetailItem';
import { useState, useEffect } from "react"
import useMsmApi from "../../../hooks/useMsmApi"
import useAuth from "../../../hooks/useAuth"

const AccountDetails = (props) => {
  const msmAPI = useMsmApi() // hook which applies JWT to api calls
  const { auth, setAuth } = useAuth()
  const [errorMsg, setErrorMsg] = useState(null)
  const [username, setUsername] = useState(null)
  const [email, setEmail] = useState(null)
  const tags = props.tags;
  const UserIcon = <PersonIcon/>
  const PWIcon = <PasswordIcon/>
  const EmailIcon = <AlternateEmailIcon/>
  const DelIcon = <RemoveCircleOutlineIcon/>
  const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
  }));

  const getName2="Fake Name"
  const getEmail="Fake Email"
  const getUserDetails = async () => {
    try {
      const resUser = await msmAPI.get(`/users/current_user_details`)
      setUsername(resUser.data.first_name)
      setEmail(resUser.data.email)
      console.log(resUser.data)
      setErrorMsg(null)
    }
    catch (err) {
      if (!err?.response) {
        setErrorMsg('No Server Response')
      } else if (err.response?.status === 401) {
        setErrorMsg('Forbidden, try login')
      } else {
        setErrorMsg('Could not reach backend server')
      }
    }
  }
  useEffect(() => {
    getUserDetails()
    console.log(username)
  }, [])
  return (
    <Grid item xs={12} md={6}>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            Profile Settings
          </Typography>
          <Demo>
            <List >
                <DetailItem label="Username" info={username} icon={UserIcon}/>
                <DetailItem label="Email" info={email} icon={EmailIcon}/>
                <DetailItem label="Password" info="********" icon={PWIcon}/>
                <DetailItem label="Delete Account" info='' icon={DelIcon}/>
            </List>
          </Demo>
        </Grid>
    
  )
}

export default AccountDetails;