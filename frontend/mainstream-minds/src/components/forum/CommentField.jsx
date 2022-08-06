import { useState, useRef } from "react"
import useMsmApi from "../../hooks/useMsmApi"
import { FlexBox } from "../styles/util.styled"
import { CommentFieldContainer } from "./forum.styled"
import { Avatar, Button, TextField, Tooltip, Typography } from "@mui/material"


const CommentField = ({ parentID, storyID, setComments, setWriteReply }) => {
  const msmAPI = useMsmApi()
  const [commentButtons, setCommentButtons] = useState(false)
  const commentRef = useRef('')

  const handleCancelButton = () => {
    if (parentID) {
      setWriteReply(false) // For reply comment fields
    }
    setCommentButtons(false)
  }

  const submit = () => {
    console.log(commentRef.current?.value)
    const body = {
      body: commentRef.current?.value,
      parent_id: parentID,
      story_id: storyID
    }
    commentRef.current.value = ''
    msmAPI.post('/comments', body)
      .then((res) => {
        const comment = res.data
        if (parentID) {
          // responding to a comment
          setComments((prevState) => {
            let comments = prevState[parentID]
            comments.push(comment)
            return {...prevState, [parentID]: comments}
          })
          setWriteReply(false) // close textfield
        }
        else {
          // Posting new root comment
          const commentID = res.data
          setComments(prevState => ({...prevState, [commentID]: [res.data]})) 
        }
      })
      .catch((err) => console.error(err))
  }

  return (
    <CommentFieldContainer reply={parentID ? 1 : 0}>
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
        {commentButtons || parentID
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
