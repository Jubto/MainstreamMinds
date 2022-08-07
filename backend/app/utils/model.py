from typing import Callable, Any, Type, List, TypeVar

from fastapi import HTTPException
from sqlmodel import SQLModel
import re

from app.settings import Settings

# https://uibakery.io/regex-library/email-regex-python
email_regex_pattern: str = r"^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
email_regex: re = re.compile(email_regex_pattern)

# Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
# https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
password_regex_pattern: str = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
password_regex: re = re.compile(password_regex_pattern)


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
            # print(field, value)
        setattr(class_instance, field, value)


ModelT = TypeVar("ModelT", bound=SQLModel)


def validate_lookup_fields(model: Type[ModelT], lookup_fields: List[str]):
    for field in lookup_fields:
        if field not in model.__fields__:
            raise HTTPException(status_code=422, detail=f"Unable to sort by field: {field}")


def password_validator(value):
    if password_regex.match(value):
        return value
    raise ValueError(
        'Password must be at least 8 characters long, contain 1 lower case, 1 upper case, 1 digit and 1 special '
        'character')


def email_validator(value):
    if email_regex.match(value):
        return value
    raise ValueError('Provided email is invalid')
