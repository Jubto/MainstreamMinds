from typing import Optional

from fastapi import Depends
from sqlmodel import select, Session
from sqlalchemy.exc import NoResultFound, IntegrityError

from app.db import get_session
from app.models.filter import ModelFilter
from app.models.institution import Institution
from app.models.pagination import Paginator, Page
from app.models.researcher import ResearcherCreate, Researcher, ResearcherUpdate, ResearcherRead
from app.models.user import User
from app.utils.model import assign_members_from_dict
from app.models.research_story import ResearchStory, ResearchStoryShortRead
from app.utils.exceptions import NonExistentEntry, AlreadyResearcher


class ResearcherRepository:
    def __init__(self, session: Session):
        self.session = session

    def add_researcher(self, new_researcher: ResearcherCreate, current_user_id: int) -> int:
        try:
            if new_researcher.institution_id is not None:
                self.session.exec(select(Institution).where(Institution.id == new_researcher.institution_id)).one()
            to_add = Researcher()
            assign_members_from_dict(to_add, new_researcher.dict(exclude_unset=True))
            to_add.user_id = current_user_id
            db_researcher = Researcher.from_orm(to_add)
            self.session.add(db_researcher)
            self.session.commit()
            return db_researcher.id
        except IntegrityError:
            raise AlreadyResearcher
        except NoResultFound:
            raise NonExistentEntry('institution_id', new_researcher.institution_id)

    def get_all(self, filter_by: Optional[ModelFilter[Researcher]], paginator: Paginator) -> Page[ResearcherRead]:
        query = select(Researcher).join(Researcher.user).join(User.preference_tags, isouter=True).join(Researcher.institution, isouter=True).distinct()
        if filter_by:
            query = filter_by.apply_filter_to_query(query)
        return Page[ResearcherRead](items=self.session.exec(paginator.paginate(query)).all(),
                                    page_count=paginator.get_page_count(self.session, query))

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

    def get_stories_by_researcher(self, researcher_id: int, paginator: Paginator) -> Page[ResearchStoryShortRead]:
        try:
            query = select(ResearchStory).where(ResearchStory.researchers.any(Researcher.id == researcher_id))
            return Page[ResearchStoryShortRead](items=self.session.exec(paginator.paginate(query)).all(),
                                                page_count=paginator.get_page_count(self.session, query))
        except NoResultFound:
            raise NonExistentEntry('Researcher_id', researcher_id)


def get_researcher_repository(session: Session = Depends(get_session)) -> ResearcherRepository:
    return ResearcherRepository(session)
