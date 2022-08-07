import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth";
import useMsmApi from "../../hooks/useMsmApi";
import { timeSince } from "../../utils/helpers";
import CommentField from "./CommentField";
import { randomColour } from '../styles/colours';
import { Avatar, Box, Button, Tooltip, Typography, styled } from "@mui/material";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ReplyIcon from '@mui/icons-material/Reply';

const CommentContainer = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0px 12px;
  gap: 4px;
`

const CommentButton = styled(Button)`
  color: ${({ theme }) => theme.palette.msm.dull};
  text-transform: capitalize;
`

const CommentHeader = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`

const CommentBody = styled(Typography)`
  padding-left: 0.5rem;
`

const CommentFooter = styled(Box)`
  color: ${({ theme }) => theme.palette.msm.dull};
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-left: 0.25rem;
  margin-top: -0.5rem;
  gap: 12px;
`

const CommentTreeContainer = styled(Box)`
  margin-bottom: 1.5rem;
`

const CommentsContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 50px;
  gap: 5px;
`

const StoryComment = ({ parentID, storyID, comment, setComments }) => {
  const { auth } = useAuth()
  const msmAPI = useMsmApi()
  const location = useLocation()
  const navigate = useNavigate()
  const [isParent, setIsParent] = useState(false)
  const [numLikes, setNumLikes] = useState(0)
  const [writeReply, setWriteReply] = useState(false)

  useEffect(() => {
    setIsParent(comment.id === parentID)
    // TEMP api call
    msmAPI.get('/comments/likes', { params: { comment_id: comment.id } })
      .then((res) => setNumLikes(res.data))
      .catch((err) => console.error(err))
  }, [])

  return (
    <CommentContainer direction='column'>
      <CommentHeader>
        <Avatar sx={{
          bgcolor: isParent ? '' : randomColour(),
          width: isParent ? 34 : 'inital',
          height: isParent ? 34 : 'inital'
        }}
        >
          {comment.user.first_name[0].toUpperCase()}{comment.user.last_name[0].toUpperCase()}
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
      <CommentFooter >
        <Tooltip title='like comment' >
          <CommentButton
            onClick={() => !auth.accessToken && navigate('/login', { state: { from: location } })}
            startIcon={<ThumbUpOffAltIcon
              sx={{ color: 'msm.dull' }}
            />}>
            {numLikes ? `${numLikes} likes` : 'no likes'}
          </CommentButton>
        </Tooltip>
        <Tooltip title='reply' >
          <CommentButton
            onClick={() => {
              !auth.accessToken && navigate('/login', { state: { from: location } })
              setWriteReply(true)}
            }
            startIcon={<ReplyIcon sx={{ color: 'msm.dull' }} />}
          >
            Reply
          </CommentButton>
        </Tooltip>
      </CommentFooter>
      {writeReply
        ? <CommentField
          parentID={parentID}
          storyID={storyID}
          setComments={setComments}
          setWriteReply={setWriteReply}
        />
        : ''
      }
    </CommentContainer>
  )
}


const StoryCommentTree = ({ rootID, storyID, comments, setComments }) => {

  return (
    <CommentTreeContainer>
      <StoryComment
        parentID={rootID}
        storyID={storyID}
        comment={comments[0]}
        setComments={setComments}
      />
      <CommentsContainer>
        {comments.slice(1).map((comment, idx) => (
          <StoryComment
            key={idx}
            parentID={rootID}
            storyID={storyID}
            comment={comment}
            setComments={setComments}
          />
        ))}
      </CommentsContainer>
    </CommentTreeContainer>
  )
}

export default StoryCommentTree