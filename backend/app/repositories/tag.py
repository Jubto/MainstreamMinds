from typing import List

from fastapi import Depends
from sqlmodel import select, Session

from app.db import get_session
from app.models.tag import Tag, TagRW
from app.models.user import User
from app.repositories.base import BaseRepository


class TagRepository():
    # model = Tag

    def __init__(self, session: Session):
        self.session = session

    # instead of querying the User table every time, could we use functions from UserRepository?
    def get_preference_tags(self, current_user_id: int) -> List[Tag]:
        return self.session.exec(select(User).where(User.id == current_user_id)).one().tag_links

    # wasn't able to get it working if the user passes in a TagRW instead of str
    # would be even better if we could also have add_preference_tags with List[TagRW]
    def add_preference_tag(self, current_user_id: int, tag: str):
        user = self.session.exec(select(User).where(User.id == current_user_id)).one()
        db_tag = self.session.exec(select(Tag).where(Tag.name == tag)).one()
        user.tag_links.append(db_tag)
        self.session.commit()

    def create_tag(self, tag: TagRW):
        db_tag = Tag.from_orm(tag)
        self.session.add(db_tag)
        self.session.commit()


def get_tag_repository(session: Session = Depends(get_session)) -> TagRepository:
    return TagRepository(session)
