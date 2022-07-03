from typing import List

from fastapi import Depends
from sqlmodel import select, Session

from app.db import get_session
from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    model = User

    def __init__(self, session: Session):
        super(UserRepository, self).__init__(User, session)

    def get_by_email(self, email: str) -> User:
        return self.session.exec(select(User).where(User.email == email)).first()


def get_user_repository(session: Session = Depends(get_session)) -> UserRepository:
    return UserRepository(session)
