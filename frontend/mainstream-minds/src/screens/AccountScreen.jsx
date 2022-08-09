import { useState, useEffect } from "react"
import useMsmApi from "../hooks/useMsmApi"
import useAuth from "../hooks/useAuth"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Button, Divider, List, ListItem, Typography, styled } from "@mui/material"
import Page from "../components/layout/Page";
import SearchStack from "../components/SearchComponents/SearchStack"
import TagSelectPopper from "../components/story/TagSelectPopper"
import Tags from "../components/layout/Tags"
import { Box } from "@mui/system";
import CardCarousel from "../components/layout/StoryCards/CardCarousel"
import AccountDetails from "../components/account/ProfileComponents/AccountDetails"
import { CarouselTitle, Subtitle } from "../components/layout/StoryCards/CardStyles"
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
//user details are breaking now >:(
const AccountScreen = () => {
  const msmAPI = useMsmApi() // hook which applies JWT to api calls
  const { auth, setAuth } = useAuth()
  const location = useLocation()
  const [errorMsg, setErrorMsg] = useState(null)
  const [username, setUsername] = useState(null)
  const [researcher, setResearcher] = useState({})

  const [type, setType] = useState(null)
  const [id, setID] = useState(null)
  // const [interests, setInterests] = useState([])
  const [allTags, setAllTags] = useState({})
  const [interests, setInterests] = useState(new Set())
  const [selectedInterest, setSelectedInterest] = useState(null)
  const [inputValue, setInputValue] = useState(null)
  const [unSelect, setUnSelect] = useState('')

  const navigate = useNavigate();
  const regis = location.state?.from?.pathname || "/researcher/register";
  //console.log(regis)

  const addSelected = (selected) => {
    setSelectedInterest(selected);
    if (selected) {
      setInterests(interests.add(selected))
      addInterests(selected)
    }
  }

  const handleEnterPress = (e) => {
    if (e.key === 'Enter' && selectedInterest) {
      addSelected(selectedInterest)
    }
  }

  const getUserDetails = async () => {
    try {
      const resUser = await msmAPI.get(`/users/me`)
      setUsername(resUser.data.first_name)
      setType(resUser.data.role)
      setID(resUser.data.id)
      const researcherRes = await msmAPI.get('/researchers/me')
      setResearcher(researcherRes.data)
      console.log('KENTO @@@@@@')
      console.log(researcherRes.data)
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

  const getTags = async () => {
    try {
      const resTags = await msmAPI.get(`tags/?page_size=1000`) // no time to utilise the pagination
      setAllTags(resTags.data.items.map((tag) => tag.name))
      console.log(resTags.data.items)
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

  const getInterests = async () => {
    try {
      const resInterests = await msmAPI.get(`tags/preference_tags`)
      resInterests.data.forEach((tag) => interests.add(tag.name))
      setInterests(interests)
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
  const addInterests = async (tagName) => {
    console.log("setting interests")
    try {
      const resInterests = await msmAPI.patch(`tags/preference_tags?tag=${tagName}`)
      setInterests(interests.add(tagName))
      getInterests()
      console.log(interests, resInterests.data)
      // setErrorMsg(null)
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

  useEffect(() => {
    if (unSelect) {
      interests.delete(unSelect)
      setInterests(interests)
      setUnSelect('')
      msmAPI.delete(`tags/preference_tags?tag=${unSelect}`)
        .then((res) => console.log(res.data))
        .catch((err) => console.error(err))
    }
  }, [unSelect])

  useEffect(() => {
    getUserDetails()
    console.log("ID IS")
    console.log(id)
    getTags()
    getInterests() //when this works need to pass interests in return
    console.log("interests are")
    console.log(interests)
    //console.log(username)
  }, [])

  const showTags = [ //replace w getting interests
    { name: "science" },
    { name: "psychology" },
    { name: "aaahh" }
  ]

  //then make itactually show their stories
  return (
    <Page align={'left'}>
      <Typography variant='h4' sx={{ mb: 2 }}>
        Welcome to your profile page {username}!
      </Typography><br />
      {type == 1 &&
        <>
          <Box sx={{ ml: -7 }}>
            {researcher.id
            ? <CardCarousel carouselTitle="My Stories" extension={`/?authors=${researcher.id}`} />
            : ''
            } 
            
          </Box>
          <Button 
            variant='contained'
            component={Link}
            to={'/upload-story'}
            state={{ from: location, body: researcher}}
            sx={{ mb: 3, mt:-1, width: '250px' }}
          >
            Post a New Story
          </Button>
          <Divider />
        </>
      }
      {/* <Box borderBottom="1px solid #ccc" sx={{ml:-5}}> */}
      <Box sx={{ ml: -7 }}>
        <CardCarousel carouselTitle="My Liked List" extension="/liked" />
      </Box>
      <Divider />
      {/* </Box> */}
      <Box borderBottom="1px solid #ccc" pt={3} pb={3}>
        <CarouselTitle sx={{ ml: 0 }}>
          My Interests
        </CarouselTitle>
        {interests.size
          ? <Tags tags={Array.from(interests)} tagSize="medium" disable={true} setUnSelect={setUnSelect} />
          : <Box sx={{ mb: 3, ml: '-60px' }}>
            <Subtitle>
              No interests selected yet..
            </Subtitle>
          </Box>

        }
        <Autocomplete
          disablePortal
          id="add-story-tags"
          name="storyTags"
          value={selectedInterest}
          onChange={(e, newValue) => addSelected(newValue)}
          inputValue={inputValue}
          onInputChange={(e, newInputValue) => {
            setInputValue(newInputValue);
          }}
          onKeyDown={handleEnterPress}
          options={allTags}
          renderInput={
            (params) =>
              <TextField
                {...params}
                label="Add interests"
                InputLabelProps={{ shrink: true }}
              />}
          PopperComponent={TagSelectPopper}
          sx={{ mt: 1.5, mb: 2, width: '500px' }}
        />
        {/* <Button variant='contained' onClick={addInterests}>Add</Button> */}
      </Box>
      <Box borderBottom="1px solid #ccc" pt={3} pb={3} w={90}>
        <CarouselTitle sx={{ ml: 0 }}>
          My Account Details
        </CarouselTitle>
        {type == 2 &&
          <Box  >
            <Typography variant='p'>
              Have an idea that you want to share with the world?
            </Typography> <br></br>
            <Button variant='contained' component={Link} to={'/researcher/registration'} state={{ from: location }} sx={{ mt: 3, mb: 3 }}>
              Register as a Verified Researcher
            </Button><br></br>
          </Box>
        }
        <AccountDetails m={4} />

      </Box>
    </Page>
    //need to be able to get and edit all of these
  )
}
//check the preference tags extensioon thingy - idk if this is the way to do this
//tis not

//need to have a fn or something to determine if researcher or regular user to decide what screen to render?
//I'm sure there's a non code-reusey way to do this?

//something to do with first render 

export default AccountScreen
