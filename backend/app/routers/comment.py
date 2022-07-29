from typing import List

from fastapi import APIRouter, Depends

from app.models.comment import CommentCreate, CommentRead
from app.core.security import get_request_user_id, is_consumer
from app.services.comment import CommentService

from app.core.security import is_consumer

router = APIRouter(tags=['comment'])

# get /comment - get all lvl 0 comments of a research story
# post /comment - add a lvl 0 comment to a research story
# get /comment/likes - get the number of likes on a comment
# post /comment/like - send true/false to like/unlike a comment

# extra:
# get /comment/reply - get all replies of a comment (1 level down)
# post /comment/reply - reply to a comment


# need to implement pagination eventually...
# also returns whether the current user (if logged in) has liked each comment or not. if logged out, return false
@router.get("", response_model=List[CommentRead])
async def get_all_comments(
        story_id: int,
        comment_service: CommentService = Depends(CommentService)
):
    """
    Given a research story id, returns a list of all comments under that story:
    """
    return comment_service.get_story_comments(story_id)


@router.post("", response_model=int, dependencies=[Depends(is_consumer)])
async def add_comment(
        comment: CommentCreate,
        comment_service: CommentService = Depends(CommentService),
        current_user_id: int = Depends(get_request_user_id)
):
    """
    Returns (if successful) the id of the new comment
    """
    return comment_service.add_comment(comment, current_user_id)


@router.get("/like", response_model=bool, dependencies=[Depends(is_consumer)])
async def get_comment_like(
        comment_id: int,
        comment_service: CommentService = Depends(CommentService),
        current_user_id: int = Depends(get_request_user_id)
):
    """
    Returns true/false on whether the current user has liked a comment
    """
    return comment_service.get_comment_like(comment_id, current_user_id)


@router.get("/likes", response_model=int)
async def get_num_likes(
        comment_id: int,
        comment_service: CommentService = Depends(CommentService),
):
    """
    Returns the number of likes on a comment
    """
    return comment_service.get_num_likes(comment_id)


@router.post("/like", response_model=None, dependencies=[Depends(is_consumer)])
async def set_comment_like(
        comment_id: int,
        liked: bool,
        comment_service: CommentService = Depends(CommentService),
        current_user_id: int = Depends(get_request_user_id)
):
    """
    Sets a comment to either liked (true) or not liked (false) by the current user
    """
    comment_service.set_comment_like(current_user_id, comment_id, liked)
