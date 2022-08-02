import { useState, useEffect } from "react"
import useMsmApi from "../../../hooks/useMsmApi";
import { CardCarousel, CarouselTitle, CarouselContainer } from "./CardStyles"
import Card from "../../layout/StoryCards/Card";

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
      <CarouselTitle>
        {title}
      </CarouselTitle>
      <CardCarousel>
        {(story && story.length) ? Object.entries(story).map(([key, value], idx) => (
          <Card 
            key={idx} 
            title={value.title} 
            tags={value.tags}
            researcherId={value.researchers[0]}
            storyId={value.id}
            showLikes={props.showLikes}
            thumbnail={value.thumbnail}
          />
        )) : <p>No stories to show</p>
        }
      </CardCarousel>
    </CarouselContainer>
  );
}

export default ScrollStories;
