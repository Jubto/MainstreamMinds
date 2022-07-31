from typing import List

from fastapi import Depends
from sqlmodel import select, Session
from sqlalchemy.exc import NoResultFound

from app.db import get_session
from app.models.researcher import ResearcherCreate, Researcher, ResearcherUpdate
from app.utils.model import assign_members_from_dict
from app.models.research_story import ResearchStory
from app.utils.exceptions import NonExistentEntry

class ResearcherRepository:
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

    def get_researcher_by_id(self, researcher_id: int) -> Researcher:
        try:
            return self.session.exec(select(Researcher).where(Researcher.id == researcher_id)).one()
        except NoResultFound:
            raise NonExistentEntry('Researcher_id', researcher_id)

    def get_researcher_by_user_id(self, user_id: int) -> Researcher:
        try:
            return self.session.exec(select(Researcher).where(Researcher.user_id == user_id)).one()
        except NoResultFound:
            raise NonExistentEntry('User_id', user_id)

    def update_researcher(self, updated_details: ResearcherUpdate, current_user_id: int) -> Researcher:
        try:
            db_researcher = self.session.exec(select(Researcher).where(Researcher.user_id == current_user_id)).one()
            assign_members_from_dict(db_researcher, updated_details.dict(exclude_unset=True))
            self.session.add(db_researcher)
            self.session.commit()
            return db_researcher
        except NoResultFound:
            raise NonExistentEntry('Researcher_id', current_user_id)

    def get_stories_by_researcher(self, researcher_id: int) -> List[ResearchStory]:
        try:
            return self.session.exec(select(Researcher).where(Researcher.id == researcher_id)).one().stories
        except NoResultFound:
            raise NonExistentEntry('Researcher_id', researcher_id)

def get_researcher_repository(session: Session = Depends(get_session)) -> ResearcherRepository:
    return ResearcherRepository(session)
