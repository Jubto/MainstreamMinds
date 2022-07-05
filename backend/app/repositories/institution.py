from typing import List

from fastapi import Depends
from sqlmodel import select, Session

from app.db import get_session
# from app.models.user import User, UserUpdate, UserCreate
from app.models.institution import Institution
from app.repositories.base import BaseRepository


class InstitutionRepository(BaseRepository[Institution]):
    model = Institution

    def __init__(self, session: Session):
        super(InstitutionRepository, self).__init__(Institution, session)

    # def get_by_email(self, email: str) -> User:
    #     return self.session.exec(select(User).where(User.email == email)).first()


def get_institution_repository(session: Session = Depends(get_session)) -> InstitutionRepository:
    return InstitutionRepository(session)
