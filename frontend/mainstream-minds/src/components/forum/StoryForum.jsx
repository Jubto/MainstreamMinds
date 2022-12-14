import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import CommentField from "./CommentField"
import StoryCommentTree from "./StoryCommentTree"
import { ForumContainer } from "./forum.styled"
import { Box, Typography } from "@mui/material"

const StoryForum = ({ storyID, researcher, msmAPI, auth }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [comments, setComments] = useState({})

  useEffect(() => {
    const queryParams = new URLSearchParams();
    queryParams.append('story_id', storyID)
    msmAPI.get(`/comments?${queryParams}`)
      .then((res) => {
        let commentTrees = {}
        res.data.forEach((comment) => {
          if (comment.parent_id === 0 || comment.parent_id == null) {
            commentTrees[comment.id] = [comment]
          }
          else {
            commentTrees[comment.parent_id].push(comment)
          }
        })
        setComments(commentTrees)
      })
      .catch((err) => console.error(err))
  }, [])

  return (
    <ForumContainer>
      <Typography variant='h6'>
        {Object.entries(comments).length
          ? `${Object.entries(comments).reduce((sum, [rootID]) => {
            return sum + comments[rootID].length}, 0)} Comments`
          : 'No comments yet!'
        }
      </Typography>
      <Box onClick={() => !auth.accessToken && navigate('/login', { state: { from: location } })}>
        <CommentField
          parentID={0}
          storyID={storyID}
          setComments={setComments}
        />
      </Box>
      {Object.entries(comments).map(([commentID, comments]) => (
        <StoryCommentTree
          key={commentID}
          comments={comments}
          setComments={setComments}
          msmAPI={msmAPI}
          auth={auth}
        />
      ))}
    </ForumContainer>
  )
}

export default StoryForum