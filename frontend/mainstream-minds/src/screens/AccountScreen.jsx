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

const AccountScreen = () => {
  const msmAPI = useMsmApi() // hook which applies JWT to api calls
  const { auth, setAuth } = useAuth()
  const location = useLocation()
  const [errorMsg, setErrorMsg] = useState(null)


  const navigate = useNavigate();
  const regis = location.state?.from?.pathname || "/researcher/register";
  console.log(regis)

  const handleUpgrade = async (event) => {
  
    event.preventDefault();
      try {
        setErrorMsg(null)
        const test_p = {
          bio: "this is a test",
          institution_id: 1
        }
        const resUpgrade = await msmAPI.post('/researchers', test_p);
       // setAuth({ accessToken: resLogin.data.access_token, role: 1 }); //this is v hard code-y 
        console.log(resUpgrade);
        navigate(regis, { replace: true });
      }
      catch(err){
          //setErrorMsg(err.response.data.detail)
      }
       // setAuth({ accessToken: resLogin.data.access_token, role: 0 }); // globally sets auth, note: temporarily leaving role: 0 (remove once /api/user/me endpoint exists)
        // TODO backend set up /api/user/me endpoint, send valid jwt, returns user details + role
       // navigate(from, { replace: true });
     
    }

  const getName = async() => {
    console.log("hi")
    try{
      const userDetails = msmAPI.get('/users/current_user_details')
      console.log(userDetails)
      //const name = userDetails.data.first_name
      console.log("it worked")
      //console.log(userDetails.data.first_name)
      return (
        <div>
        
      </div>
      )
    }
    catch(err){
      console.log("it did not")
      console.log(err)
    }
    
  }
  const getType = async () => {
    console.log("hi")
  }
  const showTags = [ //replace w getting interests
    {
      name: "science"
    },
    {
      name: "psychology"
    },
    {
      name: "agriculture"
    },
    {
      name: "computers"
    },
    {
      name: "global issues"
    },
    {
      name: "law"
    },
    {
      name: "journalism"
    },
    {
      name: "robotics"
    },
  ]

//maybe closer
//Hi {getName()}
  return (
    <Page align={'left'}>
      <Typography variant='h4'>
       Hi Username!
      </Typography><br/>
      <Box borderBottom="1px solid #ccc">
        <CardCarousel carouselTitle="My Watch List" extension="/recommendations"/>
      </Box>
      <Box borderBottom="1px solid #ccc" m={2} pt={3} pb={3}>
        <Typography variant='h5'>
          My Interests
        </Typography>
        <SearchStack tags={showTags} />
      </Box>
      <Box borderBottom="1px solid #ccc" m={2} pt={3} pb={3} w={90}>
        <Typography variant='h5'>
          My Account Details
        </Typography>
        <Typography variant='p' m={2}>
          Have an idea that you want to share with the world?
        </Typography> <br></br>
        <Button variant='contained' onClick={handleUpgrade} sx={{ m: 5 }}>
          Register as a Verified Researcher
        </Button><br></br>
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
