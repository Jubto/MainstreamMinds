import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Grid from '@mui/material/Grid';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import PasswordIcon from '@mui/icons-material/Password';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DetailItem from './DetailItem';
import { useState, useEffect } from "react"
import useMsmApi from "../../../hooks/useMsmApi"
import useAuth from "../../../hooks/useAuth"
import {UpdateName, UpdateEmail, UpdatePassword, DeleteAccount} from './UpdateFunctions';

const AccountDetails = (props) => {
  const msmAPI = useMsmApi() // hook which applies JWT to api calls
  const { auth, setAuth } = useAuth()
  const [errorMsg, setErrorMsg] = useState(null)
  const [username, setUsername] = useState(null)
  const [email, setEmail] = useState(null)
  const [role, setRole] = useState(null)
  const tags = props.tags;
  const UserIcon = <PersonIcon/>
  const PWIcon = <PasswordIcon/>
  const EmailIcon = <AlternateEmailIcon/>
  const DelIcon = <RemoveCircleOutlineIcon/>
  const InstIcon = <SchoolIcon/>
  const PosIcon = <WorkOutlineIcon/>
  const DowngradeIcon = <SettingsBackupRestoreIcon/>
 

  const getUserDetails = async () => {
    try {
      const resUser = await msmAPI.get(`/users/me`)
      setUsername(resUser.data.first_name)
      setEmail(resUser.data.email)
      setRole(resUser.data.role)
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

  //I have no clue why I can't change these icons without it crashing????
 
  return (
    <Box> {role == 1 && 

        <Grid item xs={12} md={6}>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                Researcher Settings
            </Typography>
                <List >
                    <DetailItem label="Institution" info="University" icon={InstIcon} route={UpdateName}/>
                    <DetailItem label="Institution Email" info={email} icon={EmailIcon} route={UpdateEmail}/>
                    <DetailItem label="Position" info="Position" icon={PosIcon} route={UpdatePassword}/>
                    <DetailItem label="Downgrade Account" info='' icon={DowngradeIcon} route={DeleteAccount}/>
                </List>
            
        </Grid>
    }
        <Grid item xs={12} md={6}>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                Profile Settings
            </Typography>
                <List >
                    <DetailItem label="Username" info={username} icon={UserIcon} route={UpdateName}/>
                    <DetailItem label="Email" info={email} icon={EmailIcon} route={UpdateEmail}/>
                    <DetailItem label="Password" info="********" icon={PWIcon} route={UpdatePassword}/>
                    <DetailItem label="Delete Account" info='' icon={DelIcon} route={DeleteAccount}/>
                </List>
            
        </Grid>
    </Box>
        
    
  )
}

export default AccountDetails;