import { useState, useRef } from "react"
import msmAPI from "../../api/msmAPI"
import { FlexBox } from "../styles/util.styled"
import { CommentFieldContainer } from "./forum.styled"
import { Avatar, Button, TextField, Tooltip, Typography } from "@mui/material"


const CommentField = ({ parentID, storyID, setComments, comments = [] }) => {
  const [commentOpen, setCommentOpen] = useState(false)
  const commentRef = useRef('')

  const submit = () => {
    console.log(commentRef.current?.value)
    const comment = {
      body: commentRef.current?.value,
      parent_id: parentID,
      story_id: storyID
    }
    comments.push(comment)
    commentRef.current.value = ''
    msmAPI.post('comments', comment)
      .then((res) => {
        if (parentID) {
          setComments((prevState) => {
            let temp = prevState
            temp[parentID] = comments
            return temp
          })
        }
        else {
          const commentID = res.data
          setComments((prevState) => {
            let temp = prevState
            temp[commentID] = comments
            return temp
          })
        }
      })
      .catch((err) => console.error(err))
  }

  return (
    <CommentFieldContainer>
      <Avatar />
      <Avatar>
        {'h'.toUpperCase()}
      </Avatar>
      <FlexBox direction='column' grow={1}>
        <TextField
          id='commentField'
          inputRef={commentRef}
          multiline
          variant="standard"
          placeholder={parentID ? 'Add a reply...' : 'Type your comment here'}
          onClick={() => setCommentOpen(true)}
          sx={{ width: '100%', pb: 1, flex: 1 }}
        />
        {commentOpen
          ? <FlexBox justify='flex-end'>
            <Button onClick={() => setCommentOpen(false)} sx={{ mr: 1 }}>
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
