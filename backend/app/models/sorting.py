import typing
from dataclasses import dataclass
from enum import Enum
from typing import Generic, TypeVar, List, Optional, Type

from fastapi import Query, HTTPException
from sqlalchemy import text
from sqlalchemy.sql import Select
from sqlmodel import SQLModel
from sqlmodel.sql.expression import SelectOfScalar

from app.utils.model import validate_lookup_fields

ModelT = TypeVar("ModelT", bound=SQLModel)


class SortOrdering(Enum):
    ASC = 'asc'
    DESC = 'desc'


@dataclass
class SortField:
    ordering: SortOrdering
    field: str

    def get_order_by_str(self):
        return f"{self.field} {self.ordering.value}"


class SortByFields(Generic[ModelT]):
    _model: Type[ModelT]
    _raw_value: str
    _sort_fields: Optional[List[SortField]] = None
    _allowed_sort_fields: Optional[List[str]] = None

    def __init__(self, value: str, model: Type[ModelT], allowed_sort_fields: Optional[List[str]] = None):
        self._model = model
        self._raw_value = value
        self._allowed_sort_fields = allowed_sort_fields

    def _parse(self):
        self._sort_fields = []
        for ordering in self._raw_value.split('&'):
            order = ordering[0]
            if order == '+':
                order = SortOrdering.ASC
            elif order == '-':
                order = SortOrdering.DESC
            else:
                raise HTTPException(status_code=422, detail=f"Invalid sort ordering: {order}")

            field = ordering[1:]
            if self._allowed_sort_fields is not None and field not in self._allowed_sort_fields:
                raise HTTPException(status_code=422, detail=f"Unable to sort by field: {field}")
            self._sort_fields.append(SortField(ordering=order, field=field))

        validate_lookup_fields(self._model, [f.field for f in self._sort_fields])

    def validate(self):
        self._parse()

    def get_sort_fields(self) -> List[SortField]:
        if self._sort_fields is None:
            self._parse()
        return self._sort_fields

    def apply_sort_to_query(self, query: typing.Union[Select, SelectOfScalar]):
        for field in self.get_sort_fields():
            query = query.order_by(text(field.get_order_by_str()))
        return query


def get_sort_by_fields(model_type: Type[ModelT], allowed_sort_fields: Optional[List[str]] = None) -> callable:
    """
    Gets a function that can be used to add sorting for a route that can be used as such
    sort_by: SortByFields[User] = Depends(get_sort_by_fields(User)),
    :param model_type:
    :param allowed_sort_fields: Optionally specify which fields within the specified model you can sort by
    :return: callable for use in Depends()
    :raises HTTPException(422) if field in allowed_sort_fields is not valid for model
    """
    validate_lookup_fields(model_type, allowed_sort_fields)
    query_description = 'String for what to sort by. Should take the form +field1&-field2'
    if allowed_sort_fields:
        query_description += ' (Allowed sort fields: {})'.format(', '.join(allowed_sort_fields))

    def _sort_by_query_func(sort_by: Optional[str] = Query(description=query_description, default=None)) -> \
            Optional[SortByFields[model_type]]:
        if sort_by:
            return SortByFields[model_type](sort_by, model_type)
        return None

    return _sort_by_query_func
