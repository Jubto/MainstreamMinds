from typing import List

from fastapi import Depends
from sqlmodel import select, Session

from app.db import get_session
from app.models.tag import Tag, TagRead
from app.models.user import User
from app.repositories.base import BaseRepository


class TagRepository():
    # model = Tag

    def __init__(self, session: Session):
        self.session = session

    def get_preference_tags(self, req_user_id: int) -> List[Tag]:
        return self.session.exec(select(User).where(User.id == req_user_id)).one().tag_links


def get_tag_repository(session: Session = Depends(get_session)) -> TagRepository:
    return TagRepository(session)
