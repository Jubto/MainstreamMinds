from typing import TypeVar, Generic, Any, Type, List

from fastapi import Depends
from sqlmodel import Session, SQLModel, select

from app.db import get_session

T = TypeVar('T', bound=SQLModel)


class BaseRepository(Generic[T]):

    def __init__(self, model: Type[T], session: Session):
        self.model = model
        self.session = session

    def get(self, entity_id: Any) -> T:
        return self.session.get(self.model, entity_id)

    def get_all(self) -> List[T]:
        return self.session.exec(select(self.model)).all()
