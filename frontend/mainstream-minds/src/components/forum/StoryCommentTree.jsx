import { useState, useEffect } from "react"
import msmAPI from "../../api/msmAPI";
import { timeSince } from "../../utils/helpers";
import CommentField from "./CommentField";
import { FlexBox } from "../styles/util.styled";
import { randomColour } from '../styles/colours';
import { Avatar, Box, Button, Tooltip, Typography, styled } from "@mui/material";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ReplyIcon from '@mui/icons-material/Reply';

const CommentContainer = styled(FlexBox)`
  width: 100%;
  padding: 0px 12px;
  gap: 4px;
`

const CommentHeader = styled(FlexBox)`
  padding: 0px;
  gap: 10px;
`

const CommentBody = styled(Typography)`
`

const CommentFooter = styled(FlexBox)`
  padding: 0px;
  gap: 12px;
`

const CommentTreeContainer = styled(Box)`
`

const StoryComment = ({ parentID, storyID, comment, setComments }) => {
  const [isParent, setIsParent] = useState(false)
  const [numLikes, setNumLikes] = useState(0)

  useEffect(() => {
    setIsParent(comment.id === parentID)
    // msmAPI.get('/comments/likes', { params: comment.id })
    // .then((res) => setNumLikes(res.data))
    // .catch((err) => console.error(err))
  }, [])

  return (
    <CommentContainer direction='column'>
      <CommentHeader>
        <Avatar sx={{ bgcolor: isParent ? '' : randomColour() }}>
          {comment.user.first_name[0].toUpperCase()} {comment.user.last_name[0].toUpperCase()}
        </Avatar>
        <Typography sx={{ fontWeight: 700 }}>
          {comment.user.first_name} {comment.user.last_name}
        </Typography>
        <Typography sx={{ color: 'msm.dull' }}>
          {timeSince(comment.timestamp)}
        </Typography>
      </CommentHeader>
      <CommentBody>
        {comment.body}
      </CommentBody>
      <CommentFooter>
        <Button startIcon={<ThumbUpOffAltIcon/>}>
          {numLikes ? numLikes : ''}
        </Button>
        <Button>
          Reply
        </Button>
      </CommentFooter>
    </CommentContainer>
  )
}


const StoryCommentTree = ({ rootID, storyID, comments, setComments }) => {


  return (
    <CommentTreeContainer>
      StoryCommentTree
    </CommentTreeContainer>
  )
}

export default StoryCommentTree