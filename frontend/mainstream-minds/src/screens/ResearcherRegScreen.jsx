
import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState, useEffect } from "react";
import { Button } from "@mui/material"
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import { useNavigate, useLocation } from "react-router-dom"
import Page from "../components/layout/Page";
import msmAPI from "../api/msmAPI";
import useAuth from "../hooks/useAuth";

const ResearcherRegScreen = () => {
  const { setAuth } = useAuth();
  const [insts, setInsts] = useState({})
  const [selectedInst, setSelectedInst] = useState(null)
  const [formErrors, setFormErrors] = useState({
    error: false,
    instName: null,
    instEmail: null,
    position: null,
    supervisor: null,
    bio: null,
  })
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const getInstitutions = async () => {
    const resInst = await msmAPI.get('/institutions?page_size=1000');// dont have time to implement pagination
    let temp = {}
    resInst.data.items.forEach((inst) => temp[inst.name] = inst.id)
    setInsts(temp)
  }

  const handleSubmit = async (event) => {
    console.log('Submit')
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const instEmail = data.get('instEmail');
    const position = data.get('position');
    const supervisor = data.get('supervisor');
    const bio = data.get('bio');
    formErrors.error = false;

    if (!selectedInst) {
      setFormErrors(prevState => {
        return { ...prevState, instName: true }
      })
      formErrors.error = true
    }
    if (!/^[\w]+(\.?[\w]+)*@[\w]+\.[a-zA-Z]+$/.test(instEmail)) {
      setFormErrors(prevState => {
        return { ...prevState, instEmail: true }
      })
      formErrors.error = true
    }
    if (!/^[\w]+(\s[\w]+)*$/.test(position)) {
      setFormErrors(prevState => {
        return { ...prevState, position: true }
      })
      formErrors.error = true
    }
    if (supervisor && !/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(supervisor)) {
      setFormErrors(prevState => {
        return { ...prevState, supervisor: true }
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
      try {
        const body = {
          bio: bio,
          institution_id: selectedInst,
          institution_email: instEmail,
          institution_position: position

        }
        const resReg = await msmAPI.post('/researchers', body);
        setAuth({ accessToken: resReg.data.access_token, role: 1 }); // login with new JWT
        navigate(from, { replace: true });
      }
      catch (err) {
        console.error(err)
      }
    }

  }
  useEffect(() => {
    getInstitutions()
  }, [])

  return (
    <Page align={'center'}>
      <Typography variant="h4">
        Researcher Registration
      </Typography>
      <Container component="form" noValidate onSubmit={handleSubmit} maxWidth="md" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" gutterBottom>
            Institution Details
          </Typography>
          <Grid container spacing={2} sx={{ wdith: '800px' }}>
            <Grid item xs={12}>
              <Typography variant="p">Once your institution has verified your position with them, you will be approved to begin sharing your work on Meaningful Minds!</Typography>
            </Grid>
            <Grid item xs={8}>
              <Grid container spacing={2} direction='column' mt={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    required
                    disablePortal
                    onChange={(e, newValue) => {
                      setSelectedInst(newValue)
                      formErrors.instName && setFormErrors(prevState => {
                        return { ...prevState, instName: false }
                      })
                    }}
                    id="instName"
                    options={Object.keys(insts)}
                    sx={{ width: 300 }}
                    renderInput={
                      (params) =>
                        <TextField
                          {...params}
                          label="Institution Name"
                          InputLabelProps={{ shrink: true }}
                          error={formErrors.instName}
                          helperText={formErrors.instName ? 'Must have institution selected.' : ''}
                        />}
                  />
                </Grid><br />
                <Grid item xs={6} sm={6}>
                  <TextField
                    required
                    id="instEmail"
                    name="instEmail"
                    label="Institution Email"
                    fullWidth
                    placeholder="example@email.com"
                    variant="standard"
                    onChange={() => {
                      formErrors.instEmail && setFormErrors(prevState => {
                        return { ...prevState, instEmail: false }
                      })
                    }}
                    error={formErrors.instEmail}
                    helperText={formErrors.instEmail ? 'Must be a valid email.' : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="position"
                    name="position"
                    label="Position at Institution"
                    fullWidth
                    variant="standard"
                    onChange={() => {
                      formErrors.position && setFormErrors(prevState => {
                        return { ...prevState, position: false }
                      })
                    }}
                    error={formErrors.position}
                    helperText={formErrors.position ? 'Must be a valid position.' : ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="supervisor"
                    name="supervisor"
                    label="Supervisor's Name (Optional)"
                    fullWidth
                    variant="standard"
                    onChange={() => {
                      formErrors.supervisor && setFormErrors(prevState => {
                        return { ...prevState, supervisor: false }
                      })
                    }}
                    error={formErrors.supervisor}
                    helperText={formErrors.supervisor ? 'Must be a valid supervisor name.' : ''}
                  />
                </Grid>
                <Grid item xs={8} my={4}>
                  <TextField fullWidth
                    id="bio"
                    name="bio"
                    label="Bio"
                    placeholder="Describe what your research is like"
                    multiline
                    minRows={4}
                    onChange={() => {
                      formErrors.bio && setFormErrors(prevState => {
                        return { ...prevState, bio: false }
                      })
                    }}
                    error={formErrors.bio}
                    helperText={formErrors.bio ? 'Cannot be empty.' : ''}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Button variant='contained' type='submit' >
            Request Approval
          </Button>
        </Paper>
      </Container>
    </Page>
  )
}
//figure out how to align the submit button nicely
export default ResearcherRegScreen
