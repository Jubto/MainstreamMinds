import { useState, useEffect } from "react"
import useMsmApi from "../../hooks/useMsmApi"
import CommentField from "./CommentField"
import StoryCommentTree from "./StoryCommentTree"
import { ForumContainer } from "./forum.styled"
import { Typography } from "@mui/material"

const StoryForum = ({ storyID, researcher }) => {
  const msmAPI = useMsmApi()
  const [comments, setComments] = useState({})

  useEffect(() => {
    msmAPI.get('/comments', { params: {story_id: storyID} })
      .then((res) => {
        let commentTrees = {}
        res.data.items.forEach((comment) => {
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
        ? `${Object.entries(comments).length} Comments`
        : 'No comments yet!'
        }
      </Typography>
      <CommentField parentID={0} storyID={storyID} setComments={setComments} />
      {Object.entries(comments).map(([commentID, comments]) => (
        <StoryCommentTree
          key={commentID}
          rootID={commentID}
          storyID={storyID}
          comments={comments}
          setComments={setComments}
        />
      ))}
    </ForumContainer>
  )
}

export default StoryForum