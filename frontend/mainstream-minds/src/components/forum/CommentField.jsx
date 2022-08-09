import { useState, useRef, useEffect } from "react"
import useMsmApi from "../../hooks/useMsmApi"
import { FlexBox } from "../styles/util.styled"
import { CommentFieldContainer } from "./forum.styled"
import { Avatar, Button, TextField } from "@mui/material"


const CommentField = ({
  parentID,
  storyID,
  setComments,
  setWriteReply,
  replyTo='',
  replyID=0,
  setRootReplyComment
}) => {
  const msmAPI = useMsmApi()
  const [commentButtons, setCommentButtons] = useState(false)
  const [submitted, setSubmitted] = useState(0)
  const commentRef = useRef('')
  let prevKey = useRef('')

  const handleCancelButton = () => {
    if (setWriteReply) {
      setWriteReply(false) // For reply comment fields
    }
    setCommentButtons(false)
  }

  const handleEnterPress = (e) => {
    if (e.key === 'Enter' && prevKey.current !== 'Shift') {
      submitComment() // if prev key press was shift key, i.e. Shift+Enter, it won't submit
    }
    else if (e.key !== 'Enter') {
      prevKey.current = e.key // allow for multiple shift enters in a row
    }
  }

  const submitComment = () => {
    if (!/\S+/.test(commentRef.current.value)) {
      setSubmitted(submitted + 1)
      return null // comment needs at least some substance
    }
    const body = {
      body: replyTo + commentRef.current?.value,
      parent_id: replyID ? replyID : null,
      story_id: storyID
    }
    msmAPI.post('/comments', body)
      .then((res) => {
        const comment = res.data
        if (parentID || replyID) {
          // responding to a comment
          if (parentID == null) {
            setRootReplyComment(prevState => ([...prevState, comment]))
          }
          setComments((prevState) => {
            let comments = prevState[parentID ? parentID : replyID]
            comments.push(comment)
            return {...prevState, [parentID ? parentID : replyID]: comments}
          })
          setWriteReply(false) // close textfield
        }
        else {
          // Posting new root comment
          const commentID = res.data.id
          setComments(prevState => ({...prevState, [commentID]: [res.data]}))
        }
        setSubmitted(submitted + 1)
      })
      .catch((err) => console.error(err))
  }

  useEffect(() => {
    commentRef.current.value = ''
  }, [submitted])

  return (
    <CommentFieldContainer reply={replyID ? 1 : 0}>
      <Avatar sx={{width: parentID ? 34 : 'inital', height: parentID ? 34 : 'inital'}} />
      <FlexBox direction='column' grow={1}>
        <TextField
          id='commentField'
          inputRef={commentRef}
          multiline
          autoFocus
          variant="standard"
          placeholder={parentID ? 'Add a reply...' : 'Type your comment here'}
          onKeyDown={handleEnterPress}
          onClick={() => setCommentButtons(true)}
          sx={{ width: '100%', pb: 1, flex: 1 }}
        />
        {commentButtons || parentID || setWriteReply
          ? <FlexBox justify='flex-end'>
            <Button onClick={handleCancelButton} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button
              onClick={() => commentRef.current.value && submitComment()}
              variant='contained'
            >
              {parentID ? 'Reply' : 'Comment'}
            </Button>
          </FlexBox>
          : ''
        }
      </FlexBox>
    </CommentFieldContainer>
  )
}

export default CommentField
