from dataclasses import dataclass
from enum import Enum
from typing import Any, List, Union, Generic, TypeVar, Type, Optional

from sqlmodel import SQLModel

from app.utils.model import validate_lookup_fields

ModelT = TypeVar("ModelT", bound=SQLModel)


class FilterOperation(Enum):
    LIKE = 'like'
    EQ = 'equal'
    NQ = 'nequal'
    GT = 'gt'
    LT = 'lt'


@dataclass
class FilterCompoundOperation(Enum):
    AND = 'and'
    OR = 'or'


@dataclass
class FieldFilter:
    field: str
    value: Any
    operation: FilterOperation

    def __str__(self):
        return f'{self.field} {self.operation.value} {self.value}'


@dataclass
class FilterCompound:
    filters: List[Union[FieldFilter, 'FilterCompound']]
    operator: FilterCompoundOperation

    def __str__(self):
        return '({})'.format(f' {self.operator.value} '.join([str(f) for f in self.filters]))


@dataclass
class FilterExpression:
    filter: Union[FieldFilter, FilterCompound]

    def __str__(self):
        return str(self.filter)


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


