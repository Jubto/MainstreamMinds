
import * as React from 'react';
import Grid from '@mui/material/Grid';
import {Item} from "@mui/material";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useState, useEffect} from "react";
import { Button, List, ListItem, styled } from "@mui/material"
import { positions } from '@mui/system';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import { Link, useNavigate, useLocation } from "react-router-dom"
import Page from "../components/layout/Page";
import { Box } from "@mui/system";
import msmLogin from "../api/msmLogin";
import msmAPI from "../api/msmAPI";
import useAuth from "../hooks/useAuth";

const ResearcherRegScreen = () => {
  const {setAuth} = useAuth();
  const [errorMsg, setErrorMsg] = useState(null)
  const [insts, setInsts] = useState({})
  const [value, setValue] = useState('Enter a brief bio');
  const [formErrors, setFormErrors] = useState({
      error: false,
      instEmail: null,
      position: null,
      email: null,
      bio: null,
    })
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const handleChange = (event) => {
      setValue(event.target.value);
    };


  //fix this to get institutions from the be 
  const getInstitutions = async () =>{
    const resInst = await msmAPI.get('/institutions?page_size=1000');// dont have time to implement pagination
    console.log(resInst.data.items)
    setInsts(resInst.data.items)
    //return resInst.data.items;
  }

  const getNames = async () =>{
    //Remove
  }

  const Institution = [
    { label: 'UNSW'},
    { label: 'USYD' },
    { label: 'CSU' },
    { label: 'QUT' },
    { label: 'UQ' }
    ];

    const handleSubmit = async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const instName = data.get('instName');
      const instEmail = data.get('instEmail');
      const position = data.get('position');
      //Disregarding supervisors name for now
      const bio = data.get('bio');
      formErrors.error = false;

      if (!/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(instName)) {
        setFormErrors(prevState => {
          return { ...prevState, instName: true }
        })
        formErrors.error = true
      }
      if (!/^[\w]+(\.?[\w]+)*@[\w]+\.[a-zA-Z]+$/.test(instEmail)) {
        setFormErrors(prevState => {
          return {...prevState, instEmail: true}
        })
        formErrors.error = true
      }
      if (!/^[\w]+(\s[\w]+)*$/.test(position)) {
        setFormErrors(prevState => {
          return { ...prevState, position: true }
        })
        formErrors.error = true
      }
      if (!bio) {
        setFormErrors(prevState => {
          return { ...prevState, bio: true }
        })
        formErrors.error = true
      }
      if (!formErrors.error) {
        setErrorMsg(null)
        try {
          const body = {
            bio: bio,
            institution_id: 1, //do this properly
            institution_email: instEmail,
            institution_position: position

          }
          const resReg = await msmAPI.post('/researchers', body);
          // Registration success - login with details
          const resID = resReg.data.researcher_id
          const currentUserProfile = await msmLogin.get('/users/me', {headers: {Authorization: `Bearer ${resReg.data.access_token}`}});
          setAuth({accessToken: resReg.data.access_token, role: currentUserProfile.data.role});
          navigate(from, {replace: true});
        } 
        catch (err) {
          console.error(err)
        }
      }

    }
    useEffect(() => {
      getInstitutions()
      //console.log(username)
    }, [])

  return (
    <Page align={'center'}>
    <Typography variant="h5" gutterBottom>
        Researcher Registration 
    </Typography>
    <Container component="form" noValidate onSubmit={handleSubmit} maxWidth="sm" sx={{ mb: 4 }}>
    <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
    <Typography variant="h6" gutterBottom>
        Institution Details
    </Typography>
    <Grid container spacing={2}>
    <Grid item xs={12}>
     <Typography variant="p">Once your institution has verified your position with them, you will be approved to begin sharing your work on Meaningful Minds!</Typography>
     </Grid> 
        <Grid item xs={8}>
          <Grid container spacing={2} direction='column' mt={2}>
            <Grid item xs={12}>
              <Autocomplete
              required
              disablePortal
              id="instName"
              options={insts}
              sx={{ width: 300 }}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => <TextField {...params} label="Institution Name" />}
               />
            </Grid><br/>
            <Grid item xs={6} sm={6}>
              <TextField
                required
                id="instEmail"
                name="instEmail"
                label="Institution Email"
                fullWidth
                autoComplete="example@email.com"
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="position"
                name="position"
                label="Position at Institution"
                fullWidth
                autoComplete="Researcher"
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="supervisor"
                name="supervisor"
                label="Supervisor's Name (Optional)"
                fullWidth
                autoComplete="Supervisor"
                variant="standard"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={8} my={4}>
        <TextField fullWidth
          id="bio"
          label="Bio"
          multiline
          minRows={4}
          value={value}
          onChange={handleChange}
        />
        </Grid>
        <Grid item xs={4}>
          <Box>
            <Button variant='contained' type='submit' mr={4}>
             Request Approval
             </Button>
          </Box>
        </Grid>
      </Grid>

    </Paper>
    </Container>
    </Page>
  )
}
//figure out how to align the submit button nicely
export default ResearcherRegScreen
