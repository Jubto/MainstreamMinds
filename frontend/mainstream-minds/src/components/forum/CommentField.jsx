import { useState, useRef } from "react"
import useMsmApi from "../../hooks/useMsmApi"
import { FlexBox } from "../styles/util.styled"
import { CommentFieldContainer } from "./forum.styled"
import { Avatar, Button, TextField, Tooltip, Typography } from "@mui/material"


const CommentField = ({
  parentID,
  storyID,
  setComments,
  setWriteReply,
  replyTo='',
  replyID=0,
  setRootReplyComment
}) => {
  const msmAPI = useMsmApi() // TODO potentially only have one of these at parent component and pass down, see if its less calls
  const [commentButtons, setCommentButtons] = useState(false)
  const commentRef = useRef('')

  const handleCancelButton = () => {
    if (setWriteReply) {
      setWriteReply(false) // For reply comment fields
    }
    setCommentButtons(false)
  }

  const submit = () => {
    const body = {
      body: replyTo + commentRef.current?.value,
      // body: commentRef.current?.value,
      parent_id: replyID ? replyID : parentID,
      story_id: storyID
    }
    commentRef.current.value = ''
    msmAPI.post('/comments', body)
      .then((res) => {
        const comment = res.data
        if (parentID || replyID) {
          // responding to a comment
          if (parentID === 0) {
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
      })
      .catch((err) => console.error(err))
  }

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
          onClick={() => setCommentButtons(true)}
          sx={{ width: '100%', pb: 1, flex: 1 }}
        />
        {commentButtons || parentID || setWriteReply
          ? <FlexBox justify='flex-end'>
            <Button onClick={handleCancelButton} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button
              // disabled={!/\S+/.test(commentRef.current.value)} requires commentRef to be state not ref. not sure if I should
              onClick={() => commentRef.current.value && submit()}
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
