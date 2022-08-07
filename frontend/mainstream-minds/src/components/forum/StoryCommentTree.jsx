import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { timeSince } from "../../utils/helpers";
import CommentField from "./CommentField";
import { randomColour } from '../styles/colours';
import {
  CommentContainer,
  CommentButton,
  CommentHeader,
  CommentBody,
  CommentFooter,
  CommentTreeContainer,
  CommentsContainer
} from "./forum.styled";
import { Avatar, Tooltip, Typography } from "@mui/material";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ReplyIcon from '@mui/icons-material/Reply';


const StoryComment = ({
  comment,
  setComments,
  setRootReplyComment,
  msmAPI,
  auth,
  hideButtons = false
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isParent, setIsParent] = useState(false)
  const [writeReply, setWriteReply] = useState(false)
  const [hasLiked, setHasLiked] = useState(false)
  const [avatarBgColor, setAvatarBcColor] = useState('')
  const [replyTo, setReplyTo] = useState('')
  const [replyID, setReplyID] = useState('')

  const setLike = () => {
    !auth.accessToken && navigate('/login', { state: { from: location } })
    const queryParams = new URLSearchParams();
    queryParams.append('comment_id', comment.id)
    queryParams.append('liked', !hasLiked)
    if (!hasLiked) {
      comment.num_likes++
      msmAPI.put(`/comments/like?${queryParams}`)
        .then((res) => console.log(res))
        .catch((err) => console.error(err))
    }
    else {
      comment.num_likes && comment.num_likes--
      msmAPI.put(`/comments/like?${queryParams}`)
        .then((res) => console.log(res))
        .catch((err) => console.error(err))
    }
    setHasLiked(!hasLiked)
  }

  const openReply = () => {
    !auth.accessToken && navigate('/login', { state: { from: location } })
    setWriteReply(true)
  }

  useEffect(() => {
    setAvatarBcColor(randomColour())
    setIsParent(comment.parent_id === 0)
    setReplyTo(comment.parent_id ? `@${comment.user.first_name} ` : '')
    setReplyID(comment.parent_id ? comment.parent_id : comment.id)
    if (auth) {
      msmAPI.get('/comments/like', { params: { comment_id: comment.id } })
        .then((res) => res.data && setHasLiked(true))
        .catch((err) => console.error(err))
    }
  }, [])

  return (
    <CommentContainer direction='column' >
      <CommentHeader>
        <Avatar sx={{
          bgcolor: avatarBgColor,
          width: isParent ? 'inital' : 34,
          height: isParent ? 'inital' : 34
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
      {hideButtons
        ? ''
        : <CommentFooter >
          <Tooltip title='like comment' >
            <CommentButton
              onClick={setLike}
              startIcon={<ThumbUpOffAltIcon sx={{ color: 'msm.dull' }}/>}
              sx={{ml: comment.num_likes ? 0 : '-0.75rem'}}
            >
              {comment.num_likes ? `${comment.num_likes} ${comment.num_likes === 1 ? 'like' : 'likes' }` : ''}
            </CommentButton>
          </Tooltip>
          <Tooltip title='reply' >
            <CommentButton
              onClick={openReply}
              startIcon={<ReplyIcon sx={{ color: 'msm.dull' }} />}
              sx={{ml: comment.num_likes ? 0 : '-2rem'}}
            >
              Reply
            </CommentButton>
          </Tooltip>
        </CommentFooter>
      }
      {writeReply
        ? <CommentField
          parentID={comment.parent_id}
          storyID={comment.story_id}
          setComments={setComments}
          setWriteReply={setWriteReply}
          replyTo={replyTo}
          replyID={replyID}
          setRootReplyComment={setRootReplyComment}
        />
        : ''
      }
    </CommentContainer>
  )
}


const StoryCommentTree = ({ comments, setComments, msmAPI, auth }) => {
  const [showReplies, setShowReplies] = useState(false)
  const [rootReplyComment, setRootReplyComment] = useState([])

  const handleShowComments = () => {
    setShowReplies(!showReplies)
    setRootReplyComment([])
  }

  return (
    <CommentTreeContainer>
      <StoryComment
        comment={comments[0]}
        setComments={setComments}
        setRootReplyComment={setRootReplyComment}
        msmAPI={msmAPI}
        auth={auth}
      />
      <CommentButton
        onClick={handleShowComments}
        sx={{ ml: 1, mt: -1, mb: (comments.length - 1 > rootReplyComment.length) && !showReplies ? 2 : 0 }}
      >
        {comments.length > 1 && (comments.length - 1 > rootReplyComment.length)
          ? showReplies
            ? 'Hide replies'
            : `Show ${comments.length - 1 - rootReplyComment.length} replies`
          : ''
        }
      </CommentButton>
      {(() => {
        if (showReplies) {
          return (
            <CommentsContainer>
              {comments.slice(1).map((comment, idx) => (
                <StoryComment
                  key={idx}
                  comment={comment}
                  setComments={setComments}
                  msmAPI={msmAPI}
                  auth={auth}
                />
              ))}
            </CommentsContainer>
          )
        }
        else if (rootReplyComment.length) {
          return (
            <CommentsContainer sx={{ pb: 0, mt: showReplies ? 0 : -2, mb: 2 }}>
              {rootReplyComment.map((comment, idx) => (
                <StoryComment
                  key={idx}
                  comment={comment}
                  setComments={setComments}
                  hideButtons={true}
                  msmAPI={msmAPI}
                  auth={auth}
                />
              ))}
            </CommentsContainer>
          )
        }
        else {
          return ''
        }
      })()}
    </CommentTreeContainer>
  )
}

export default StoryCommentTree