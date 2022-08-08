from typing import Callable, Any, Type, List, TypeVar

from fastapi import HTTPException
from sqlmodel import SQLModel
import re

from app.settings import Settings

# https://uibakery.io/regex-library/email-regex-python
email_regex_pattern: str = r"^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
email_regex: re = re.compile(email_regex_pattern)
# https://stackoverflow.com/a/30795206
youtube_regex_pattern: str = "^(?:https?:)?(?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]{7,15})(?:[\?&][a-zA-Z0-9\_-]+=[a-zA-Z0-9\_-]+)*$"
youtube_regex: re = re.compile(youtube_regex_pattern)


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
        setattr(class_instance, field, value)


ModelT = TypeVar("ModelT", bound=SQLModel)


def validate_lookup_fields(model: Type[ModelT], lookup_fields: List[str]):
    for field in lookup_fields:
        if field not in model.__fields__:
            raise HTTPException(status_code=422, detail=f"Unable to sort by field: {field}")


def password_validator(value: str) -> str:
    if len(value) >= 8:
        return value
    raise ValueError(
        'Password must be at least 8 characters long')



def email_validator(value: str) -> str:
    if email_regex.match(value):
        return value
    raise ValueError('Provided email is invalid')


def youtube_validator(value: str) -> str:
    if match := youtube_regex.search(value):
        return "https://youtube.com/embed/" + match.group(1)
    else:
        raise ValueError('Youtube url invalid')

