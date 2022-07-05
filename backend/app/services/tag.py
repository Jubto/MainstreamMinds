from typing import List

from fastapi import Depends
from sqlalchemy import select
from sqlmodel import Session

from app.core.security import get_request_user_id
from app.db import get_session
from app.models.tag import Tag, TagRead
from app.repositories.tag import TagRepository, get_tag_repository
from app.utils.model import ModelFieldsMapping


class TagService:

    def __init__(self, tag_repository: TagRepository = Depends(get_tag_repository)):
        self.repository = tag_repository
        # self.field_mappings = ModelFieldsMapping()
        # self.field_mappings.add_field_mapping('password', 'password_hash', value_mapping_func=get_password_hash)

    def get_preference_tags(self, current_user_id: int) -> List[Tag]:
        return self.repository.get_preference_tags(current_user_id)
