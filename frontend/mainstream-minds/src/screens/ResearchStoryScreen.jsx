import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import useMsmApi from "../hooks/useMsmApi"
import { useParams } from "react-router-dom"
import { getColourForString } from "../components/styles/colours"
import Page from "../components/layout/Page"
import StoryForum from "../components/forum/StoryForum"
import { FlexBox } from "../components/styles/util.styled"
import { Avatar, Box, Button, Typography, styled } from "@mui/material"

const tempURL = "https://www.youtube.com/embed/aRGdDy18qfY"

const StoryContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px 68px;
  gap: 10px;
`

const StoryDetailsContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const StoryMetrics = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* padding: 0px 68px; */
  gap: 4px;
`

const AuthorContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const ResearchStoryScreen = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()
  const { auth } = useAuth()
  const msmAPI = useMsmApi()
  const [researcher, setResearcher] = useState({})
  const [researcherInstitution, setResearcherInstitution] = useState(null)
  const [story, setStory] = useState({})
  const [hasLiked, setHasLiked] = useState(false)
  const [numStoryLikes, setNumStoryLikes] = useState(0)

  const formatDate = (utcDateString) => {
    const date = new Date(utcDateString)
    return `${date.getUTCDay()} ${date.getMonth()}, ${date.getFullYear()}`
  }

  const setLike = () => {
    !auth.accessToken && navigate('/login', { state: { from: location } })
    const queryParams = new URLSearchParams();
    queryParams.append('story_id', id)
    queryParams.append('liked', !hasLiked)
    if (!hasLiked) {
      setNumStoryLikes(numStoryLikes + 1)
      msmAPI.put(`/research_stories/like?${queryParams}`)
        .then((res) => console.log(res))
        .catch((err) => console.error(err))
    }
    else {
      setNumStoryLikes(numStoryLikes - 1)
      msmAPI.put(`/research_stories/like?${queryParams}`)
        .then((res) => console.log(res))
        .catch((err) => console.error(err))
    }
    setHasLiked(!hasLiked)
  }

  useEffect(() => {

    msmAPI.get(`/research_stories/${id}`)
      .then((res) => {
        setStory(res.data)
        setResearcher(res.data.researchers[0])
        msmAPI.get(`/institutions/${res.data.researchers[0].institution_id}`)
        .then((res) => setResearcherInstitution(res.data))
        .catch((err) => console.error(err))
      })
      .catch((err) => console.error(err))

    msmAPI.get(`/research_stories/likes?story_id=${id}`)
      .then((res) => setNumStoryLikes(res.data))
      .catch((err) => console.error(err))

    msmAPI.get(`/research_stories/like?story_id=${id}`)
      .then((res) => setHasLiked(res.data))
      .catch((err) => console.error(err))

    

  }, [])

  return (
    <Page>
      <StoryContainer>
        <iframe width="1204px" height="663px" src={tempURL}
          title="YouTube video player" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
        <StoryDetailsContainer>
          <StoryMetrics>
            <Typography sx={{ fontWeight: 700 }}>
              {story.title}
            </Typography>
            <FlexBox>
              <Typography variant='caption'>
                {formatDate(story.publish_date)}
              </Typography>
              <Typography variant='caption'>
                {numStoryLikes
                  ? numStoryLikes === 1 ? `${numStoryLikes} like` : `${numStoryLikes} likes`
                  : 'No likes'
                }
              </Typography>
            </FlexBox>
            <FlexBox>
              <Button onClick={setLike} color={hasLiked ? 'success' : 'primary'}>
                {hasLiked ? 'liked' : 'like'}
              </Button>
              <Button>
                Read Journal
              </Button>
            </FlexBox>
          </StoryMetrics>
          <AuthorContainer>
            <Avatar  />
            <Box>
              <Typography sx={{fontWeight: 700}}>
                {researcher.user.first_name} {researcher.user.last_name}
              </Typography>
              <Typography variant='caption'>
                {researcherInstitution.name}
              </Typography>
            </Box>
          </AuthorContainer>
        </StoryDetailsContainer>
      </StoryContainer>
      <StoryForum
        storyID={id}
        researcher={researcher}
        msmAPI={msmAPI}
        auth={auth}
      />
    </Page>
  )
}

export default ResearchStoryScreen