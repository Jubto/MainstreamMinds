from typing import List

from fastapi import Depends
from sqlalchemy import select
from sqlmodel import Session

from app.db import get_session
from app.models.user import UserRead, User
from app.repositories.user import UserRepository, get_user_repository


class UserService:

    def __init__(self,
                 session: Session = Depends(get_session),
                 user_repository: UserRepository = Depends(get_user_repository),
                 ):
        self.repository = user_repository
        self.session = session

    def get_all(self) -> List[User]:
        return self.repository.get_all()
