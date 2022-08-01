from typing import List

from fastapi import Depends

from app.models.comment import CommentCreate, Comment
from app.models.pagination import Paginator, Page
from app.repositories.comment import get_comment_repository, CommentRepository


class CommentService:

    def __init__(self, comment_repository: CommentRepository = Depends(get_comment_repository)):
        self.repository = comment_repository

    def add_comment(self, new_comment: CommentCreate, current_user_id: int):
        return self.repository.add_comment(new_comment, current_user_id)

    def get_story_comments(self, story_id: int, paginator: Paginator) -> Page[Comment]:
        return self.repository.get_story_comments(story_id, paginator)

    def set_comment_like(self, current_user_id: int, comment_id: int, liked: bool):
        self.repository.set_comment_like(current_user_id, comment_id, liked)

    def get_comment_like(self, comment_id: int, current_user_id: int) -> bool:
        return self.repository.get_comment_like(current_user_id, comment_id)

    def get_num_likes(self, comment_id: int) -> int:
        return self.repository.get_num_likes(comment_id)