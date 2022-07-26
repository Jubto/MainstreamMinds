from typing import List

from fastapi import Depends

from app.models.comment import CommentCreate, Comment
from app.repositories.comment import get_comment_repository, CommentRepository


class CommentService:

    def __init__(self, comment_repository: CommentRepository = Depends(get_comment_repository)):
        self.repository = comment_repository

    def add_comment(self, new_comment: CommentCreate, current_user_id: int):
        return self.repository.add_comment(new_comment, current_user_id)

    def get_story_comments(self, story_id: int) -> List[Comment]:
        return self.repository.get_story_comments(story_id)
