import { IconButton } from "@mui/material";
import { useState, useEffect, } from "react"
import useMsmApi from "../../../hooks/useMsmApi";
import { CarouselTitle, CarouselContainer, AddInterestBtn } from "./CardStyles"
import ScrollStories from "./ScrollStories";
import { useNavigate } from "react-router-dom";

const CardCarousel = (props) => {
  const msmAPI = useMsmApi() // hook which applies JWT to api calls
	const [errorMsg, setErrorMsg] = useState(null)
	const [story, setStory] = useState({})
  let navigate = useNavigate(); 
  
  const extension = props.extension || ''
  const title = props.carouselTitle
  const interestBtn = props.interestBtn
  // console.log(`/research_stories${extension}`)

  const getStories = async () => {
    try {
      const resStory = await msmAPI.get(`/research_stories${extension}`)
      setStory(resStory.data.items ? resStory.data.items : resStory.data)
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

  const handleInterestClick = () => {
    navigate('/account')
  }

  useEffect(() => {
    getStories()
  }, [])

  return (
    <CarouselContainer>
      <CarouselTitle>
        {title}
        {interestBtn && <IconButton onClick={handleInterestClick}>
          <AddInterestBtn />
        </IconButton>}
      </CarouselTitle>
      <ScrollStories story={story} emptyText={props.emptyText}/>
    </CarouselContainer>
  );
}

export default CardCarousel;
