from typing import List
import math

from fastapi import Depends
from sqlmodel import select, Session

from app.db import get_session
from app.models.comment import CommentCreate, Comment
from app.models.pagination import Page, Paginator
from app.models.user import User
from app.repositories.user import UserRepository, get_user_repository
from app.utils.model import assign_members_from_dict


class CommentRepository:
    def __init__(self, session: Session, user_repository: UserRepository = Depends(get_user_repository)):
        self.session = session
        self.user_repository = user_repository

    def add_comment(self, new_comment: CommentCreate, current_user_id: int) -> int:
        to_add = Comment()
        assign_members_from_dict(to_add, new_comment.dict(exclude_unset=True))
        to_add.user_id = current_user_id
        db_comment = Comment.from_orm(to_add)
        self.session.add(db_comment)
        self.session.commit()
        return db_comment.id

    def get_story_comments(self, story_id: int) -> List[Comment]:
        return self.session.exec(select(Comment).where(Comment.story_id == story_id)).all()

    def set_comment_like(self, current_user_id: int, comment_id: int, liked: bool):
        comment = self.session.exec(select(Comment).where(Comment.id == comment_id)).one()
        # should be using user_repository here, but it doesn't work for some reason
        current_user = self.session.exec(select(User).where(User.id == current_user_id)).one()
        if liked and current_user not in comment.user_likes:
            comment.user_likes.append(current_user)
        elif not liked and current_user in comment.user_likes:
            comment.user_likes.remove(current_user)
        self.session.add(comment)
        self.session.commit()

    def get_comment_like(self, current_user_id: int, comment_id: int) -> bool:
        comment = self.session.exec(select(Comment).where(Comment.id == comment_id)).one()
        # should be using user_repository here, but it doesn't work for some reason
        current_user = self.session.exec(select(User).where(User.id == current_user_id)).one()
        return current_user in comment.user_likes

    def get_num_likes(self, comment_id: int) -> int:
        comment = self.session.exec(select(Comment).where(Comment.id == comment_id)).one()
        return len(comment.user_likes)


def get_comment_repository(session: Session = Depends(get_session)) -> CommentRepository:
    return CommentRepository(session)
