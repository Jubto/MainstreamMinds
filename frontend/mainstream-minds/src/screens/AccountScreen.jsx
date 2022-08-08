import { useState, useEffect} from "react"

import useMsmApi from "../hooks/useMsmApi"
import useAuth from "../hooks/useAuth"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Button, List, ListItem, Typography, styled } from "@mui/material"
import Page from "../components/layout/Page";
import SearchStack from "../components/SearchComponents/SearchStack"
import Tags from "../components/layout/Tags"
import { Box } from "@mui/system";
import CardCarousel from "../components/layout/StoryCards/CardCarousel"
import AccountDetails from "../components/account/ProfileComponents/AccountDetails"
import { CarouselTitle } from "../components/layout/StoryCards/CardStyles"
//user details are breaking now >:(
const AccountScreen = () => {
  const msmAPI = useMsmApi() // hook which applies JWT to api calls
  const { auth, setAuth } = useAuth()
  const location = useLocation()
  const [errorMsg, setErrorMsg] = useState(null)
  const [username, setUsername] = useState(null)
  const [type, setType] = useState(null)
  const [id, setID] = useState(null)
  const [interests, setInterests] = useState({})

  const navigate = useNavigate();
  const regis = location.state?.from?.pathname || "/researcher/register";
  //console.log(regis)

    const getUserDetails = async () => {
      try {
        const resUser = await msmAPI.get(`/users/me`)
        setUsername(resUser.data.first_name)
        setType(resUser.data.role)
        setID(resUser.data.id)
        //console.log(resUser.role)
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
          console.log("ERROR IS:")
          console.log(err)
        }
      }
    }
    useEffect(() => {
      getUserDetails()
      console.log("ID IS")
      console.log(id)
      getInterests() //when this works need to pass interests in return
      console.log("interests are")
      console.log(interests)
      //console.log(username)
    }, [])

  const showTags = [ //replace w getting interests
    {name: "science"},
    {name: "psychology"}
  ]

//maybe closer
//Hi {getName()}
// call function after h4 to check and render researcher stuff
 //remember to change to id == 2
 //then make itactually show their stories
return (
    <Page align={'left'}>
      <Typography variant='h4'>
       Hi {username}!
      </Typography><br/>
      {type == 1 && 
        <Box borderBottom="1px solid #ccc">
        <CardCarousel carouselTitle="My Stories" extension="/recommendations"/>
      </Box>
      }
      <Box borderBottom="1px solid #ccc">
        <CardCarousel carouselTitle="My Watch List" extension="/recommendations"/>
      </Box>
      <Box borderBottom="1px solid #ccc" m={2} pt={3} pb={3}>
        <CarouselTitle>
          My Interests
        </CarouselTitle>
        <SearchStack tags={showTags} sx={{ml:8}}/>
      </Box>
      <Box borderBottom="1px solid #ccc" m={2} pt={3} pb={3} w={90}>
        <CarouselTitle>
          My Account Details
        </CarouselTitle>
        {type == 2 && 
        <Box>
          <Typography variant='p' m={8}>
            Have an idea that you want to share with the world?
          </Typography> <br></br>
          <Button variant='contained' component={Link} to={'/researcher/registration'} state={{ from: location }} sx={{ml:12}}>
            Register as a Verified Researcher
          </Button><br></br>
          </Box>
        }
        <AccountDetails/>
 
      </Box>
    </Page>
    //need to be able to get and edit all of these
  )
}
//check the preference tags extensioon thingy - idk if this is the way to do this
//tis not

//need to have a fn or something to determine if researcher or regular user to decide what screen to render?
//I'm sure there's a non code-reusey way to do this?

export default AccountScreen
