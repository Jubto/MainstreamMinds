import math
from dataclasses import dataclass
from typing import List, Union, Generic, TypeVar

from fastapi import Query
from pydantic.generics import GenericModel
from sqlalchemy.sql import Select
from sqlmodel import SQLModel
from sqlmodel.sql.expression import SelectOfScalar

ModelT = TypeVar("ModelT", bound=SQLModel)


class Page(GenericModel, Generic[ModelT]):
    items: List[ModelT]
    page_count: int


@dataclass
class Paginator:
    page_size: int = 10
    page: int = 0

    def paginate(self, query: Union[Select, SelectOfScalar]) -> Union[Select, SelectOfScalar]:
        return query.limit(self.page_size).offset(self.page * self.page_size)

    def get_page_count(self, session, base_query: Union[Select, SelectOfScalar]) -> int:
        return math.ceil(len(session.exec(base_query).all()) / self.page_size)


def get_paginator(page: int = Query(default=0, description='The page to get using pagination (0 indexed)'),
                  page_size: int = Query(default=10, description='The number of results per page')) -> Paginator:
    return Paginator(page=page, page_size=page_size)
