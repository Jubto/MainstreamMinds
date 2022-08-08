import { useState, useEffect} from "react"
import useMsmApi from "../../hooks/useAuth"
import useAuth from "../../hooks/useAuth"
import { CardCarouselStyle, Scroll, NextIcon, cardSize, BackIcon, Subtitle } from "./StoryCards/CardStyles"
import { CarouselTitle } from "./StoryCards/CardStyles"
import Tags from "./Tags"
import { Box } from "@mui/material"
import SearchStack from "../SearchComponents/SearchStack"



const ScrollInterests = async () => {
    //const [interests, setInterests] = useState({})
   // const [errorMsg, setErrorMsg] = useState(null)
   // const msmAPI = useMsmApi() 
   /* const getInterests = async () => {
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
      const addInterests = async () => {
        console.log("setting interests")
      }*/
  
     
  
      //useEffect(() => {
        //getInterests() //when this works need to pass interests in return
        //console.log("interests are")
        //console.log(interests)
        //console.log(username)
     // }, [])
     const showTags = [ //replace w getting interests
     {name: "science"},
     {name: "psychology"},
     {name: "television"}
   ]

    return(
    <Box>
    <CarouselTitle>
        My Interests
      </CarouselTitle>
      
    </Box>
    )
      
  }

  export default ScrollInterests
  //<Tags tags={interests}> </Tags>
  //<SearchStack tags={showTags}/>