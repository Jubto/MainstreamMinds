import { useState, useEffect } from "react"
import msmAPI from "../../api/msmAPI"
import CommentField from "./CommentField"
import StoryCommentTree from "./StoryCommentTree"
import { ForumContainer } from "./forum.styled"

const StoryForum = ({ storyID, researcher }) => {
  const [comments, setComments] = useState({})

  useEffect(() => {
    msmAPI.get(`/comments/${storyID}`)
      .then((res) => {
        let tree = {}
        res.data.items.forEach((comment) => {
          if (comment.parent_id === 0) {
            tree[comment.id] = [comment]
          }
          else {
            tree[comment.parent_id].push(comment)
          }
        })
        setComments(tree)
      })
      .catch((err) => console.error(err))
  }, [])

  return (
    <ForumContainer>
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