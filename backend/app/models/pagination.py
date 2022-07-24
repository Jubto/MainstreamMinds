from dataclasses import dataclass
from enum import Enum
from typing import Any, List, Union, Generic, TypeVar, Type, Optional

from fastapi import Query
from pydantic import BaseModel, PositiveInt
from pydantic.generics import GenericModel
from sqlalchemy import or_, and_
from sqlalchemy.sql import Select
from sqlmodel import SQLModel
from sqlmodel.sql.expression import SelectOfScalar, col

from app.models.user import User
from app.utils.model import validate_lookup_fields

ModelT = TypeVar("ModelT", bound=SQLModel)


class Page(GenericModel, Generic[ModelT]):
    items: List[ModelT]
    page_count: int


@dataclass
class Paginator:
    page_count: int = 10
    page: int = 0

    def paginate(self, query: Union[Select, SelectOfScalar]) -> Union[Select, SelectOfScalar]:
        return query.limit(self.page_count).offset(self.page * self.page_count)


def get_paginator(page: int = Query(default=0), page_count: int = Query(default=10)) -> Paginator:
    return Paginator(page=page, page_count=page_count)
