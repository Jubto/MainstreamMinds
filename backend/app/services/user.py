from typing import List, Optional

from fastapi import Depends
from sqlalchemy import select
from sqlmodel import Session

from app.core.security import get_password_hash
from app.db import get_session
from app.models.base import SortByFields
from app.models.user import UserRead, User, UserCreate
from app.repositories.user import UserRepository, get_user_repository
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
        self.repository.create(user_create, mappings=self.field_mappings)

    def get_all(self, sort_by: Optional[SortByFields[User]]) -> List[User]:
        return self.repository.get_all(sort_by=sort_by)
