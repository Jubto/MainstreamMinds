import { useState, useEffect } from "react"
import useMsmApi from "../hooks/useMsmApi"
import useAuth from "../hooks/useAuth"
import { Link, useLocation } from "react-router-dom"
import { Button, List, ListItem, Typography, styled } from "@mui/material"
import Page from "../components/layout/Page";
import CardCarousel from "../components/layout/StoryCards/CardCarousel"
import DiscoverBanner from "../components/layout/DiscoverBanner"
const StoryField = styled('div')`
  background-color: #bfece6;
`

const DiscoverScreen = () => {
  const msmAPI = useMsmApi() // hook which applies JWT to api calls
  const { auth, setAuth } = useAuth()
  const location = useLocation()
  const [errorMsg, setErrorMsg] = useState(null)
  const [story, setStory] = useState({})
  const [interests, setInterests] = useState({})

  const getInterests = async () => {
    try {
      const resInterests = await msmAPI.get(`tags/preference_tags`)
      setInterests(resInterests.data)
      console.log(interests, resInterests.data)
      setErrorMsg(null)
    }
    catch (err) {
      if (!err?.response) {
        setErrorMsg('No Server Response')
      } else if (err.response?.status === 401) {
        setErrorMsg('Forbidden, try login')
      } else {
        setErrorMsg(`err: ${err}`)
        console.log(err)
      }
    }
  }

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
        transcript: "string"
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

  useEffect(() => {
    getInterests()
  }, [])

  return (
    <Page>
      {auth.accessToken ? (
          <>
            <CardCarousel carouselTitle="Liked Stories" extension="/liked" emptyText="Try liking a story!"/>
            <CardCarousel carouselTitle="Recommended" extension="/recommendations?n=20" emptyText="Add some interests so we can recommend stories you might like."/>
          </>
        ) :
        <DiscoverBanner/>
      }
      <CardCarousel carouselTitle="Trending" extension="/trending"/>
      {(interests && interests.length) ? 
        Object.entries(interests).map(([key,value]) => {
          return(
            <CardCarousel 
              carouselTitle={value.name[0].toUpperCase()+value.name.substring(1)}
              extension={`?tags=${value.name}&page=0&page_size=10`}
              interestBtn={true}
            />
          )
        })
        : console.log('no interests to show')}
      <CardCarousel carouselTitle="Science" extension="?tags=science"/>
      <CardCarousel carouselTitle="Physics" extension="?tags=physics"/>
      <CardCarousel carouselTitle="Engineering" extension="?tags=engineering"/>
      {/* <Typography variant='h5'>
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
      </Typography> */}
    </Page>
  )
}

export default DiscoverScreen