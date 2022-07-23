import typing
from dataclasses import dataclass
from enum import Enum
from typing import Generic, TypeVar, List, Optional, Type

import pydantic
from fastapi import Query, Depends, HTTPException
from pydantic import BaseModel, Json, ValidationError
from pydantic.fields import ModelField
from pydantic.generics import GenericModel
from sqlmodel import SQLModel, Field

from app.models.researcher import Researcher

ModelT = TypeVar("ModelT", bound=SQLModel)


class SortOrdering(Enum):
    ASC = 0
    DESC = 0


@dataclass
class SortField:
    ordering: SortOrdering
    field: str


class SortByFields(Generic[ModelT]):
    _raw_value: str
    _sort_fields: Optional[List[SortField]] = None
    _allowed_sort_fields: Optional[List[str]] = None

    def __init__(self, value: str, allowed_sort_fields: Optional[List[str]] = None):
        self._raw_value = value
        self._allowed_sort_fields = allowed_sort_fields

    def _parse(self):
        pass
        # raise HTTPException(status_code=422, detail="Invalid sort by fields")

    def validate(self):
        self._parse()

    def get_sort_fields(self) -> List[SortField]:
        if self._sort_fields is None:
            self._parse()
        return self._sort_fields


def get_sort_by_fields(model: Type[ModelT]) -> callable:
    query_description = 'String for what to sort by should take the form +field1&-field2'
    print(validate_lookup_fields(model, []))

    def _sort_by_query_func(sort_by: str = Query(..., description=query_description)) -> SortByFields[model]:
        return SortByFields[model](sort_by)

    return _sort_by_query_func


def validate_lookup_fields(model: Type[ModelT], lookup_fields: List[str]):
    print(model)
    print(type(model))
    print(dir(model))
    print(model.__fields__)
    print(model.__table__.columns)
    print(dir(model.__fields_set__))
    for r in model.__mapper__.relationships:
        print(type(r))
        print(dir(r))
        print(r.mapper.class_)
    print([str(a) for a in model.__mapper__.relationships])

