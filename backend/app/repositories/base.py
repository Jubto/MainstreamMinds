from typing import TypeVar, Generic, Any, Type, List

from fastapi import Depends
from sqlmodel import Session, SQLModel, select

from app.db import get_session

TModel = TypeVar('TModel', bound=SQLModel)


class BaseRepository(Generic[TModel]):

    def __init__(self,
                 session: Session = Depends(get_session())
                 ):
        self.session = session

    def get(self, entity_id: Any) -> TModel:
        return self.session.get(Type[TModel], entity_id)

    def get_all(self) -> List[TModel]:
        return self.session.exec(select(Type[TModel])).all()
