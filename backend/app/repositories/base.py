import math
from typing import TypeVar, Generic, Any, Type, Optional

from sqlmodel import Session, SQLModel, select
from app.models.pagination import Page, Paginator
from app.models.sorting import SortByFields
from app.models.filter import ModelFilter
from app.utils.model import assign_members_from_dict, ModelFieldsMapping

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

    def get_all(self, sort_by: Optional[SortByFields[ModelT]] = None,
                filter_by: Optional[ModelFilter[ModelT]] = None,
                paginator: Paginator = Paginator()) -> Page[ModelT]:
        query = select(self.model)
        if sort_by:
            query = sort_by.apply_sort_to_query(query)
        if filter_by:
            query = filter_by.apply_filter_to_query(query)

        return Page[ModelT](items=self.session.exec(paginator.paginate(query)).all(),
                            page_count=paginator.get_page_count(self.session, query))

    def create(self, create_model: CreateModelT, mappings: ModelFieldsMapping = None) -> ModelT:
        entity = self.model()
        assign_members_from_dict(entity, create_model.dict(exclude_unset=True), mappings)
        self.session.add(entity)
        self.session.commit()
        return entity

    def update(self, entity_id: Any, update_model: UpdateModelT, mappings: ModelFieldsMapping = None) -> ModelT:
        entity = self.get(entity_id)
        assign_members_from_dict(entity, update_model.dict(exclude_unset=True), mappings)
        self.session.commit()
        return entity

    def delete(self, entity_id: Any) -> None:
        self.session.delete(self.get(entity_id))
        self.session.commit()
