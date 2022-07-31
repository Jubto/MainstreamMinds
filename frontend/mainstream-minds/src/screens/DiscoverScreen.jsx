import { useState, useEffect } from "react"
import useMsmApi from "../hooks/useMsmApi"
import useAuth from "../hooks/useAuth"
import { Link, useLocation } from "react-router-dom"
import { Button, List, ListItem, Typography, styled } from "@mui/material"
import Page from "../components/layout/Page";
/* import ScrollStories from "../components/layout/StoryCards/ScrollStories" */
import Card from "../components/layout/StoryCards/Card"
import ScrollStories from "../components/layout/StoryCards/ScrollStories"

const StoryField = styled('div')`
  background-color: #bfece6;
`

const DiscoverScreen = () => {
  const msmAPI = useMsmApi() // hook which applies JWT to api calls
  const { auth, setAuth } = useAuth()
  const location = useLocation()
  const [errorMsg, setErrorMsg] = useState(null)
  const [story, setStory] = useState({})

  const testPostStory = async () => {
    // Testing jwt Bearer API call
    try {
      // all fields are required, schema avaliable on /docs
      const story = {
        title: "Test story",
        summary: "Lorem",
        authors: [
          {
            researcher_id: 0,
            institution_id: 0
          }
        ],
        papers: [
          {
            paper_title: "Breakthrough",
            paper_abstract: "Science",
            paper_link: "string",
            paper_citations: 0
          }
        ],
        tags: [
          {
            name: "SaaSy"
          }
        ],
        content_body: "Vestibulum gravida dapibus risus, quis lacinia eros mattis viverra.",
        thumbnail: "string",
        video_link: "string",
      }
      const resStory = await msmAPI.post('/research_stories', story)
      setStory(resStory.data)
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

  return (
    <Page sx={{ ml: 10, mt: 10 }}>
      <ScrollStories />
      <ScrollStories extension="/trending"/>
      <Typography variant='h5'>
        Temp routes
      </Typography>
      <br />
      <List>
        <ListItem component={Link} to={'/'} state={{ from: location }}>
          discover
        </ListItem >
        <ListItem component={Link} to={'/search'} state={{ from: location }}>
          search
        </ListItem >
        <ListItem component={Link} to={'/login'} state={{ from: location }}>
          login
        </ListItem >
        <ListItem component={Link} to={'/sign-up'} state={{ from: location }}>
          sign-up
        </ListItem >
        <ListItem component={Link} to={'/researcher/registration'} state={{ from: location }}>
          researcher registration
        </ListItem >
        <ListItem component={Link} to={'/researcher/John'} state={{ from: location }}>
          researcher
        </ListItem >
        <ListItem component={Link} to={'/research-story/1'} state={{ from: location }}>
          research story
        </ListItem >
        <ListItem component={Link} to={'/account'} state={{ from: location }}>
          account :<b>Protected: min role 'user'</b>
        </ListItem >
        <ListItem component={Link} to={'/upload-story'} state={{ from: location }}>
          upload story :<b>Protected: min role 'researcher'</b>
        </ListItem >
        <ListItem component={Link} to={'/preview-story'} state={{ from: location }}>
          preview story :<b>Protected: min role 'researcher'</b>
        </ListItem >
      </List>
      <br />
      <Button variant='contained' onClick={testPostStory} sx={{ mr: 5 }}>
        Press to post story
      </Button>
      {auth.accessToken
        ? <Button variant='contained' color='error' onClick={() => setAuth({})}>
          Log out
        </Button>
        : ''
      }
      <br />
      <Typography variant='subtitle1' sx={{ color: 'error.main', mt: 2, ml: 2 }}>
        {errorMsg}
        {Object.entries(story).length && auth.accessToken
          ? <div>
            <Typography variant='subtile2' sx={{color: 'success.main', fontWeight:1000}}>
              New database entry created
            </Typography>
            <br />
            {Object.entries(story).map(([key, value], idx) => (
              <StoryField key={idx}>
                {key} : {key === 'authors' ? 'authors' : value}
              </StoryField>
            ))}
          </div>
          : ''
        }
      </Typography>
    </Page>
  )
}

export default DiscoverScreen