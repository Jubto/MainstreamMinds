from fastapi import Depends
from sqlmodel import select, Session
from sqlalchemy.exc import NoResultFound

from app.db import get_session
from app.models.pagination import Page, Paginator
from app.repositories.base import BaseRepository
from app.models.institution import Institution, InstitutionRead, InstitutionCreate, InstitutionUpdate
from app.models.researcher import Researcher
from app.utils.model import assign_members_from_dict
from app.utils.exceptions import NonExistentEntry


class InstitutionRepository(BaseRepository[Institution, InstitutionUpdate, InstitutionCreate]):

    def get_institutions(self, paginator: Paginator) -> Page[InstitutionRead]:
        query = select(Institution)
        return Page[InstitutionRead](items=self.session.exec(paginator.paginate(query)).all(),
                                     page_count=paginator.get_page_count(self.session, query))

    def get_institution_by_id(self, institution_id: int) -> Institution:
        try:
            return self.session.exec(select(Institution).where(Institution.id == institution_id)).one()
        except NoResultFound:
            raise NonExistentEntry('Institution_id', institution_id)

    def update_institution(self, updated_institution: InstitutionUpdate, institution_id: int) -> int:
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
    
    def delete_institution(self, institution_id: int):
        try:
            self.session.delete(self.get(institution_id))
            self.session.commit()
        except:
            raise NonExistentEntry('Institution_id', institution_id)

    def get_institution_researchers(self, paginator: Paginator, institution_id: int) -> Page[Researcher]:
        query = select(Researcher).where(Researcher.institution_id == institution_id)
        return Page[Researcher](items=self.session.exec(paginator.paginate(query)).all(),
                                     page_count=paginator.get_page_count(self.session, query))

def get_institution_repository(session: Session = Depends(get_session)) -> InstitutionRepository:
    return InstitutionRepository(Institution, session)
