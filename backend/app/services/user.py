from typing import List

from fastapi import Depends
from sqlalchemy import select
from sqlmodel import Session

from app.db import get_session
from app.models.user import UserRead, User


class UserService:

    def __init__(self,
                 session: Session = Depends(get_session)
                 ):
        self.session = session

    def get_all(self) -> List[User]:
        users = self.session.exec(select(User)).all()
        print(users)
        return [] # TODO: Figure out mapping of SQLModel with inheritance
