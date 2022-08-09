import {useState, useEffect} from "react"
import {useLocation, useNavigate} from "react-router-dom"
import {monthNames} from "../utils/enums"
import useAuth from "../hooks/useAuth"
import useMsmApi from "../hooks/useMsmApi"
import {useParams} from "react-router-dom"
import {getColourForString} from "../components/styles/colours"
import Page from "../components/layout/Page"
import Tags from "../components/layout/Tags"
import StoryForum from "../components/forum/StoryForum"
import {FlexBox} from "../components/styles/util.styled"
import {
  StoryContainer,
  StoryDetailsContainer,
  StoryMetrics,
  AuthorContainer,
  StoryBody
} from "../components/story/story.styled"
import {Avatar, Box, Button, Tooltip, Typography} from "@mui/material"
import ThumbUpOffAltRoundedIcon from '@mui/icons-material/ThumbUpOffAltRounded';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import MenuBookIcon from '@mui/icons-material/MenuBook';


const ResearchStoryScreen = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const {id} = useParams()
  const {auth} = useAuth()
  const msmAPI = useMsmApi()
  const [researcher, setResearcher] = useState({})
  const [researcherInstitution, setResearcherInstitution] = useState({})
  const [story, setStory] = useState({})
  const [hasLiked, setHasLiked] = useState(false)
  const [numStoryLikes, setNumStoryLikes] = useState(0)
  const [bgColor, setBgColor] = useState('')

  const formatDate = (utcDateString) => {
    const date = new Date(utcDateString)
    return `${date.getDate()} ${monthNames[date.getMonth()]}, ${date.getFullYear()}`
  }

  const goToPaper = () => {
    if (story.papers.includes('http')) {
      if (auth.accessToken) {
        window.open(location.state.redirect, '_blank')
      } else {
        navigate('/login', {state: {from: location, redirect: story.papers}})
      }
    }
  }

  const setLike = () => {
    !auth.accessToken && navigate('/login', {state: {from: location}})
    const queryParams = new URLSearchParams();
    queryParams.append('story_id', id)
    queryParams.append('liked', !hasLiked)
    if (!hasLiked) {
      setNumStoryLikes(numStoryLikes + 1)
      msmAPI.put(`/research_stories/like?${queryParams}`)
        .then((res) => console.log(res))
        .catch((err) => console.error(err))
    } else {
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
        console.log(res.data)
        setResearcher(res.data.researchers[0])
        const researcherTmp = res.data.researchers[0]
        setBgColor(getColourForString(researcherTmp.user.first_name + researcherTmp.user.last_name))
        msmAPI.get(`/institutions/${researcherTmp.institution_id}`)
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

    if (location.state?.redirect) {
      window.open(location.state.redirect, '_blank')
    }

  }, [])

  return (
    <Page>
      <StoryContainer>
        <iframe width="1204px" height="663px" src={story.video_link}
                title="YouTube video player" frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
        />
        <StoryDetailsContainer>
          <StoryMetrics>
            <Typography variant='h5' sx={{fontWeight: 700}}>
              {story.title}
            </Typography>
            <FlexBox gap='16px'>
              <Typography variant='subtitle2'>
                {formatDate(story.publish_date)}
              </Typography>
              <Typography variant='subtitle2'>
                {numStoryLikes
                  ? numStoryLikes === 1 ? `${numStoryLikes} like` : `${numStoryLikes} likes`
                  : 'No likes'
                }
              </Typography>
            </FlexBox>
            <FlexBox gap='8px'>
              <Button
                onClick={setLike}
                variant='contained'
                startIcon={hasLiked ? <ThumbUpOffAltRoundedIcon/> : <ThumbUpOffAltIcon/>}
                sx={{height: '30px'}}
              >
                {hasLiked ? 'liked' : 'like'}
              </Button>
              <Tooltip title='Go to published Paper'>
                <Button
                  onClick={goToPaper}
                  variant='contained'
                  startIcon={<MenuBookIcon/>}
                  sx={{height: '30px'}}
                >
                  Read Journal
                </Button>
              </Tooltip>
            </FlexBox>
          </StoryMetrics>
          <AuthorContainer onClick={() => navigate(`/researcher/${researcher.id}`)}>
            <Avatar sx={{bgcolor: bgColor, width: 58, height: 58, mr: 1}}>
              {researcher.user?.first_name[0].toUpperCase()}{researcher.user?.last_name[0].toUpperCase()}
            </Avatar>
            <Box>
              <Typography sx={{fontWeight: 700, mb: -0.5}}>
                {researcher.user?.first_name} {researcher.user?.last_name}
              </Typography>
              <Typography variant='caption'>
                {researcherInstitution.name}
              </Typography>
            </Box>
          </AuthorContainer>
        </StoryDetailsContainer>
        <StoryBody>
          {story.summary}
        </StoryBody>
        <Tags tags={story.tags} tagSize="medium"/>
        <Box sx={{mb: '4rem'}}/>
        <StoryForum
          storyID={id}
          researcher={researcher}
          msmAPI={msmAPI}
          auth={auth}
        />
      </StoryContainer>
    </Page>
  )
}

export default ResearchStoryScreen
