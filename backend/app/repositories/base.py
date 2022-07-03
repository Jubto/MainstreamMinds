from typing import TypeVar, Generic, Any, Type, List

from fastapi import Depends
from sqlmodel import Session, SQLModel, select
from app.db import get_session
from app.utils.model import assign_members_from_dict

ModelT = TypeVar('ModelT', bound=SQLModel)
UpdateModelT = TypeVar('UpdateModelT', bound=SQLModel)
CreateModelT = TypeVar('CreateModelT', bound=SQLModel)


class BaseRepository(Generic[ModelT, UpdateModelT, CreateModelT]):
    """
    Base class for model repositories, inherit from this and provide the
    types for the generics [ModelT, UpdateModelT, CreateModelT]. Override a function
    to provide a custom implementation
    """

    def __init__(self, model: Type[ModelT], session: Session):
        self.model = model
        self.session = session

    def get(self, entity_id: Any) -> ModelT:
        return self.session.get(self.model, entity_id)

    def get_all(self) -> List[ModelT]:
        return self.session.exec(select(self.model)).all()

    def create(self, create_model: CreateModelT) -> ModelT:
        entity = self.model(**create_model)
        self.session.add(entity)
        self.session.commit()
        return entity

    def update(self, entity_id: Any, update_model: UpdateModelT) -> ModelT:
        entity = self.get(entity_id)
        assign_members_from_dict(entity, update_model.dict(exclude_unset=True))
        self.session.commit()
        return entity

    def delete(self, entity_id: Any) -> None:
        self.session.delete(self.get(entity_id))
        self.session.commit()
