from typing import Any, List

from fastapi import Depends
from sqlmodel import Session, select

from app.db import get_session
from app.models.user import User


class TestRepository:

    def __init__(self,
                 session: Session = Depends(get_session)
                 ):
        self.session = session

    def get(self, entity_id: Any) -> User:
        return self.session.get(User, entity_id)

    def get_all(self) -> List[User]:
        return self.session.exec(select(User)).all()