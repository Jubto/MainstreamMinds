from typing import Callable, Any, Type, List, TypeVar

from fastapi import HTTPException
from sqlmodel import SQLModel


class ModelFieldsMapping:
    _mappings = {}

    def add_field_mapping(self, field_to_map: str, output_field: str, value_mapping_func: Callable = None):
        self._mappings[field_to_map] = (output_field, value_mapping_func)

    def map_field(self, field_name: str, field_value: Any):
        mapping = self._mappings.get(field_name, None)
        if not mapping:
            return field_name, field_value

        if mapping[1] is not None:
            field_value = mapping[1](field_value)
        return mapping[0], field_value


def assign_members_from_dict(class_instance: object, dict_to_assign: dict,
                             field_mappings: ModelFieldsMapping = None):
    for field, value in dict_to_assign.items():
        if field_mappings:
            field, value = field_mappings.map_field(field, value)
            print(field, value)
        setattr(class_instance, field, value)


ModelT = TypeVar("ModelT", bound=SQLModel)


def validate_lookup_fields(model: Type[ModelT], lookup_fields: List[str]):
    for field in lookup_fields:
        # TODO: Consider verifying types
        if field not in model.__fields__:
            raise HTTPException(status_code=422, detail=f"Unable to sort by field: {field}")
    # TODO: Consider implementing relational lookups using the following
    # for r in model.__mapper__.relationships:
    #     print(type(r))
    #     print(dir(r))
    #     print(r.mapper.class_)
    # print([str(a) for a in model.__mapper__.relationships])
