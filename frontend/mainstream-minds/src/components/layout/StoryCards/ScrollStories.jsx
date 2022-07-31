import { useState, useEffect } from "react"
import useMsmApi from "../../../hooks/useMsmApi";
import { CardCarousel } from "./CardStyles"
import Card from "../../layout/StoryCards/Card";
import { Button } from '@mui/material/';

const ScrollStories = (props) => {/* 
  const msmAPI = useMsmApi() // hook which applies JWT to api calls
	const [errorMsg, setErrorMsg] = useState(null) */
	const story = props.story
  //console.log(story)
	
	/* async () => {
    // Testing jwt Bearer API call
    try {
      const resStory = await msmAPI.get('/research_stories')
      setStory(resStory.data)
			console.log(story, typeof story)
      Object.entries(story).map(([key, value], idx) => (
        console.log(key, value, idx, value.authors, value.authors[0].researcher_name)
      ))
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
    testGetStories()
  }) */
  
  return (
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
  );
}

export default ScrollStories;
