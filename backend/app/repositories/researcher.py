from typing import List

from fastapi import Depends
from sqlmodel import select, Session

from app.db import get_session
from app.models.user import User, UserUpdate, UserCreate
from app.models.researcher import Researcher, ResearcherCreate, Researcher
from app.repositories.base import BaseRepository
from app.utils.model import assign_members_from_dict


class ResearcherRepository:
    model = Researcher

    def __init__(self, session: Session):
        self.session = session

    def add_researcher(self, new_researcher: ResearcherCreate, current_user_id: int) -> int:
        to_add = Researcher()
        assign_members_from_dict(to_add, new_researcher.dict(exclude_unset=True))
        to_add.user_id = current_user_id
        db_researcher = Researcher.from_orm(to_add)
        self.session.add(db_researcher)
        self.session.commit()
        return db_researcher.id

    def get_researcher_by_id(self, researcher_id) -> Researcher:
        return self.session.exec(select(Researcher).where(Researcher.id == researcher_id)).one()


def get_researcher_repository(session: Session = Depends(get_session)) -> ResearcherRepository:
    return ResearcherRepository(session)
