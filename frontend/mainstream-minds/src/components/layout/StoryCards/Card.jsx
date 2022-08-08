import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import useMsmApi from "../../../hooks/useMsmApi";
import { Typography } from '@mui/material/';
import { CardLink, CardTitle, StyledCard, CardContent } from "./CardStyles";
import { FlexBox } from "../../styles/util.styled";
import Tags from "../Tags"
import BookmarkIcon from '@mui/icons-material/Bookmark';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

const Card = (props) => {
  const navigate = useNavigate()
  const msmAPI = useMsmApi() // hook which applies JWT to api calls
  const [errorMsg, setErrorMsg] = useState(null)
  const [story, setStory] = useState({})
  const [liked, setLiked] = useState(false)

  // Pass story info in and render
  const title = props.title
  const tags = props.tags
  const researcher = props.researcher
  const storyId = props.storyId
  const thumbnail = props.thumbnail
  console.log(`I am card ${title}`)
  console.log(researcher)

  const getLiked = async () => {
    try {
      const result = await msmAPI.get(`research_stories/like?story_id=${storyId}`)
      console.log(result)
      setLiked(result.data)
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
  /* const getResearcher = async (id) => {
  try {
    const result = await msmAPI.get(`researchers/${id}`)
  }
  }
  } */

  useEffect(() => {
    if (props.showLikes) {
      getLiked()
    }
  }, [])

  return (
    <StyledCard>
      <CardLink
        onClick={() => navigate(`/research-story/${storyId}`)}
        component="img"
        height="140"
        image={thumbnail}
      />
      <CardContent>
        <CardTitle>
          {title}
        </CardTitle>
        <FlexBox gap='0.5rem'>
          <Typography variant="body2" color="text.secondary">
            {researcher?.user.first_name} {researcher?.user.last_name}
          </Typography>
          <TaskAltIcon color='primary' fontSize='small' />
        </FlexBox>
      </CardContent>
      <div>
        <Tags tags={tags} tagSize="small" />
      </div>
    </StyledCard>
  );
}

export default Card;

