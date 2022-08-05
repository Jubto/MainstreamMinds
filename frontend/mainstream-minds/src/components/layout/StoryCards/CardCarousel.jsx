import { useState, useEffect, useRef } from "react"
import useMsmApi from "../../../hooks/useMsmApi";
import { CardCarouselStyle, CarouselTitle, CarouselContainer } from "./CardStyles"
import ScrollStories from "./ScrollStories";

const CardCarousel = (props) => {
  const ref = useRef(null);
  const msmAPI = useMsmApi() // hook which applies JWT to api calls
	const [errorMsg, setErrorMsg] = useState(null)
	const [story, setStory] = useState({})
  
  const extension = props.extension || ''
  const title = props.carouselTitle

  const getStories = async () => {
    try {
      const resStory = await msmAPI.get(`/research_stories/${extension}`)
      setStory(resStory.data.items)
			console.log(resStory.data, typeof resStory.data)
      console.log(story, story.items)
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
      <CarouselTitle>
        {title}
      </CarouselTitle>
      <ScrollStories story={story}/>
    </CarouselContainer>
  );
}

export default CardCarousel;
