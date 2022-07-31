from typing import List

from fastapi import Depends
from sqlmodel import select, Session

from app.db import get_session
from app.models.user import User, UserUpdate, UserCreate, Role
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User, UserUpdate, UserCreate]):
    model = User

    def __init__(self, session: Session):
        super(UserRepository, self).__init__(User, session)

    def get_by_email(self, email: str) -> User:
        return self.session.exec(select(User).where(User.email == email)).first()

    # could be dangerous
    def update_role(self, user_id: int, new_role: Role):
        user = self.get(user_id)
        user.role = new_role
        self.session.add(user)
        self.session.commit()


def get_user_repository(session: Session = Depends(get_session)) -> UserRepository:
    return UserRepository(session)
