from typing import Optional

from fastapi import Depends

from app.core.security import get_password_hash
from app.models.pagination import Page, Paginator
from app.models.sorting import SortByFields
from app.models.filter import ModelFilter
from app.models.user import User, UserCreate, UserUpdate
from app.repositories.user import UserRepository, get_user_repository
from app.utils.exceptions import EmailAlreadyExistsHttpException
from app.utils.model import ModelFieldsMapping


class UserService:
    field_mappings: ModelFieldsMapping

    def __init__(self,
                 user_repository: UserRepository = Depends(get_user_repository),
                 ):
        self.repository = user_repository
        self.field_mappings = ModelFieldsMapping()
        self.field_mappings.add_field_mapping('password', 'password_hash', value_mapping_func=get_password_hash)

    def create(self, user_create: UserCreate):
        if self.repository.get_by_email(user_create.email):
            raise EmailAlreadyExistsHttpException()
        return self.repository.create(user_create, mappings=self.field_mappings)

    def update(self, current_user_id: int, user_update: UserUpdate):
        return self.repository.update(current_user_id, user_update, mappings=self.field_mappings)

    def delete(self, current_user_id: int):
        self.repository.delete(current_user_id)

    def get(self, user_id: int):
        return self.repository.get(user_id)

    def get_all(self, sort_by: Optional[SortByFields[User]] = None,
                filter_by: Optional[ModelFilter[User]] = None,
                paginator: Optional[Paginator] = None) -> Page[User]:
        return self.repository.get_all(sort_by=sort_by, filter_by=filter_by, paginator=paginator)
