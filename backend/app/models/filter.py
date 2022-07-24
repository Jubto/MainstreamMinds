from dataclasses import dataclass
from enum import Enum
from typing import Any, List, Union, Generic, TypeVar, Type, Optional

from sqlalchemy import or_, and_
from sqlalchemy.sql import Select
from sqlmodel import SQLModel
from sqlmodel.sql.expression import SelectOfScalar, col

ModelT = TypeVar("ModelT", bound=SQLModel)


class FilterOperation(Enum):
    LIKE = 'like'
    ILIKE = 'ilike'
    EQ = 'equal'
    NQ = 'nequal'
    GT = 'gt'
    GTE = 'gte'
    LT = 'lt'
    LTE = 'lte'


@dataclass
class FilterCompoundOperation(Enum):
    AND = 'and'
    OR = 'or'


class Filter:
    def get_filter_criteria(self) -> Any:
        raise NotImplemented()


@dataclass
class FieldFilter(Filter):
    field: str
    value: Any
    operation: FilterOperation
    model: Type[ModelT]

    def __str__(self):
        return f'{self.field} {self.operation.value} {self.value}'

    def get_filter_criteria(self) -> Any:
        model_field = getattr(self.model, self.field)

        if self.operation == FilterOperation.LIKE:
            return col(model_field).like(f'%{self.value}%')
        elif self.operation == FilterOperation.ILIKE:
            return col(model_field).ilike(f'%{self.value}%')
        elif self.operation == FilterOperation.EQ:
            return model_field == self.value
        elif self.operation == FilterOperation.NQ:
            return model_field != self.value
        elif self.operation == FilterOperation.GT:
            return model_field > self.value
        elif self.operation == FilterOperation.GTE:
            return model_field >= self.value
        elif self.operation == FilterOperation.LT:
            return model_field < self.value
        elif self.operation == FilterOperation.LTE:
            return model_field <= self.value


@dataclass
class FilterCompound(Filter):
    filters: List[Union[FieldFilter, 'FilterCompound']]
    operator: FilterCompoundOperation

    def __str__(self):
        return '({})'.format(f' {self.operator.value} '.join([str(f) for f in self.filters]))

    def get_filter_criteria(self) -> Any:
        children_criteria = [f.get_filter_criteria() for f in self.filters]
        if self.operator == FilterCompoundOperation.AND:
            return or_(*children_criteria)
        elif self.operator == FilterCompoundOperation.OR:
            return and_(*children_criteria)


@dataclass
class FilterExpression(Filter):
    filter: Union[FieldFilter, FilterCompound]

    def __str__(self):
        return str(self.filter)

    def get_filter_criteria(self) -> Union[Select, SelectOfScalar]:
        return self.filter.get_filter_criteria()


class ModelFilter(Generic[ModelT]):
    _model: Type[ModelT]
    _filter_expression: Optional[FilterExpression] = None
    _allowed_filter_fields: Optional[List[str]] = None

    def __init__(self, filter_expression: FilterExpression, model: Type[ModelT],
                 _allowed_filter_fields: Optional[List[str]] = None):
        self._model = model
        self._filter_expression = filter_expression
        self._allowed_sort_fields = _allowed_filter_fields
        # TODO: Validate lookup fields
        # validate_lookup_fields(self._model, [f.field for f in self._sort_fields])

    def apply_filter_to_query(self, query: Union[Select, SelectOfScalar]):
        return query.where(self._filter_expression.get_filter_criteria())
