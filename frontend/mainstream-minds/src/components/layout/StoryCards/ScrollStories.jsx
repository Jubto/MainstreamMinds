import { useState, useEffect } from "react"
import useMsmApi from "../../../hooks/useMsmApi";
import { CardCarousel, CarouselContainer } from "./CardStyles"
import Card from "../../layout/StoryCards/Card";
import { Typography, Button } from '@mui/material/';

const ScrollStories = (props) => {
  const msmAPI = useMsmApi() // hook which applies JWT to api calls
	const [errorMsg, setErrorMsg] = useState(null)
	const [story, setStory] = useState({})
  
  const extension = props.extension || ''
  const title = props.carouselTitle

  const getStories = async () => {
    try {
      const resStory = await msmAPI.get(`/research_stories${extension}`)
      setStory(resStory.data)
			console.log(story, typeof story)
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
    getStories()
  }, [])
  
  return (
    <CarouselContainer>
      <Typography gutterBottom variant="h5" component="div">
				<b>{title}</b>
      </Typography>
      <CardCarousel>
        {story && Object.entries(story).map(([key, value], idx) => (
          <Card 
            key={idx} 
            title={value.title} 
            author={value.authors[0].researcher_name}
            tags={value.tags}
          />
        ))}
        <Card />
      </CardCarousel>
    </CarouselContainer>
  );
}

export default ScrollStories;
