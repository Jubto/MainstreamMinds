import { useState, useEffect } from "react"
import useMsmApi from "../hooks/useMsmApi"
import { useParams } from "react-router-dom"
import Page from "../components/layout/Page"
import StoryForum from "../components/forum/StoryForum"

const ResearchStoryScreen = () => {
  const msmAPI = useMsmApi()
  const { id } = useParams()
  const [researcher, setResearcher] = useState({})
  const [story, setStory] = useState({})

  useEffect(() => {
    console.log(`story is: ${id}`)
    msmAPI.get(`/research_stories/${id}`)
    .then((res) => {
      setStory(res.data)
      setResearcher(res.data.researchers[0])
    })
    .catch((err) => console.error(err))
  }, [])

  return (
    <Page>
      ResearchStoryScreen
      <br/>
      <StoryForum storyID={id} researcher={researcher} />
    </Page>
  )
}

export default ResearchStoryScreen