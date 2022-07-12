from typing import List

from fastapi import Depends

from app.models.institution import Institution, InstitutionRead
from app.repositories.institution import InstitutionRepository, get_institution_repository


class InstitutionService:

    def __init__(self, institution_repository: InstitutionRepository = Depends(get_institution_repository)):
        self.repository = institution_repository
        # self.field_mappings = ModelFieldsMapping()
        # self.field_mappings.add_field_mapping('password', 'password_hash', value_mapping_func=get_password_hash)

    def get_institutions(self, current_story_id: int) -> List[Institution]:
        return self.repository.get_institution_repository(current_story_id)

    def add_preference_tag(self, current_story_id: int, tag: str):
        self.repository.add_institution_(current_story_id, tag)

    def create_tag(self, tag: TagRW):
        self.repository.create_tag(tag)