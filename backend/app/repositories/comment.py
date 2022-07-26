from typing import List

from fastapi import Depends
from sqlmodel import select, Session

from app.db import get_session
from app.models.comment import CommentCreate, Comment, CommentRead
from app.repositories.user import UserRepository, get_user_repository
from app.utils.model import assign_members_from_dict


class CommentRepository:
    def __init__(self, session: Session, user_repository: UserRepository = Depends(get_user_repository)):
        self.session = session
        self.user_repository = user_repository

    def add_comment(self, new_comment: CommentCreate, current_user_id: int):
        to_add = Comment()
        assign_members_from_dict(to_add, new_comment.dict(exclude_unset=True))
        to_add.user_id = current_user_id
        db_comment = Comment.from_orm(to_add)
        self.session.add(db_comment)
        self.session.commit()
        return db_comment.id

    def get_story_comments(self, story_id: int) -> List[Comment]:
        return self.session.exec(select(Comment).where(Comment.story_id == story_id)).all()


def get_comment_repository(session: Session = Depends(get_session)) -> CommentRepository:
    return CommentRepository(session)
