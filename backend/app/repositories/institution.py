from typing import List

from fastapi import Depends
from sqlmodel import select, Session
from sqlalchemy.exc import NoResultFound

from app.db import get_session
from app.repositories.base import BaseRepository
from app.models.institution import Institution, InstitutionRead, InstitutionCreate, InstitutionUpdate
# TODO: verify what the ResearchStory object looks like
from app.models.research_story import ResearchStory
from app.utils.model import assign_members_from_dict
from app.utils.exceptions import NonExistentEntry

class InstitutionRepository(BaseRepository[Institution, InstitutionUpdate, InstitutionCreate]):

    def get_institutions(self) -> List[Institution]:
        pass
        # TODO
        # return self.session.exec(select(ResearchStory).where(ResearchStory.id == current_story_id)).one().institution_links

    def get_institution_by_id(self, institution_id) -> Institution:
        try:
            return self.session.exec(select(Institution).where(Institution.id == institution_id)).one()
        except NoResultFound:
            raise NonExistentEntry('Institution_id', institution_id)
    
    # need to assess what info we want to pass in for an institution
    def update_institution(self, updated_institution: InstitutionUpdate, institution_id: int):
        try:
            db_institution = self.session.exec(select(Institution).where(Institution.id == institution_id)).one()
            assign_members_from_dict(db_institution, updated_institution.dict(exclude_unset=True))
            self.session.add(db_institution)
            self.session.commit()
            return db_institution.id
        except NoResultFound:
            raise NonExistentEntry('Researcher_id', institution_id)

    def create_institution(self, new_institution: InstitutionCreate) -> int:
        to_add = Institution()
        assign_members_from_dict(to_add, new_institution.dict(exclude_unset=True))
        db_institution = Institution.from_orm(to_add)
        self.session.add(db_institution)
        self.session.commit()
        return db_institution.id
    
    def delete_institution(self, institution_id):
        pass
    # TODO
    # Include error handling if non-existant id given


def get_institution_repository(session: Session = Depends(get_session)) -> InstitutionRepository:
    return InstitutionRepository(Institution, session)
