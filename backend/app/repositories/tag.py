from typing import List, Optional

from fastapi import Depends
from sqlmodel import select, Session

from app.db import get_session
from app.models.pagination import Page, Paginator
from app.models.tag import Tag, TagRead, TagCreate
from app.models.user import User
from app.repositories.user import UserRepository, get_user_repository


class TagRepository:
    def __init__(self, session: Session, user_repository: UserRepository):
        self.session = session
        self.user_repository = user_repository  # injection into class fields rather than dependency in get_preference_tags

    # instead of querying the User table every time, could we use functions from UserRepository?
    def get_preference_tags(self, current_user_id: int) -> List[Tag]:
        return self.user_repository.get(current_user_id).preference_tags

    # wasn't able to get it working if the user passes in a TagRW instead of str
    # would be even better if we could also have add_preference_tags with List[TagRW]
    def add_preference_tag(self, current_user_id: int, tag: str):
        user = self.session.exec(select(User).where(User.id == current_user_id)).one()
        db_tag = self.session.exec(select(Tag).where(Tag.name == tag)).one()
        user.preference_tags.append(db_tag)
        self.session.commit()

    def create_tag(self, tag: TagCreate):
        db_tag = Tag.from_orm(tag)
        self.session.add(db_tag)
        self.session.commit()
        return db_tag

    def get_tag_by_id(self, tag_id: int) -> Tag:
        return self.session.exec(select(Tag).where(Tag.id == tag_id)).one()

    def get_tags(self, paginator: Paginator) -> Page[TagRead]:
        query = select(Tag)
        return Page[TagRead](items=self.session.exec(paginator.paginate(query)).all(),
                             page_count=paginator.get_page_count(self.session, query))

    def get_tag_by_name(self, name: str) -> Optional[Tag]:
        return self.session.exec(select(Tag).where(Tag.name == name)).first()


def get_tag_repository(session: Session = Depends(get_session),
                       user_repository: UserRepository = Depends(get_user_repository)) -> TagRepository:
    return TagRepository(session, user_repository)
