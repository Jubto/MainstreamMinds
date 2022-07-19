from typing import List

from fastapi import APIRouter, Depends

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
@router.get("", response_model=None)
async def get_all_comments(story_id: int):
    return None


@router.post("", response_model=None)
async def add_comment(comment: str):
    return None


@router.get("/like", response_model=None)
async def get_comment_likes(comment_id: int):
    return None


# maybe should be put method?
@router.post("/like", response_model=None)
async def set_comment_like(comment_id: int, liked: bool):
    return None