from typing import List

from fastapi import Depends

from app.models.institution import Institution, InstitutionRead, InstitutionCreate
from app.repositories.institution import InstitutionRepository, get_institution_repository


class InstitutionService:
    pass
    # def __init__(self, institution_repository: InstitutionRepository = Depends(get_institution_repository)):
    #     self.repository = institution_repository
    #     # self.field_mappings = ModelFieldsMapping()
    #     # self.field_mappings.add_field_mapping('password', 'password_hash', value_mapping_func=get_password_hash)

    # def get_institutions(self, current_story_id: int) -> List[Institution]:
    #     return self.repository.get_institution_repository(current_story_id)
    
    #field_mappings: ModelFieldsMapping

    def __init__(self,
                 institution_repository: InstitutionRepository = Depends(get_institution_repository)
                ):
        self.repository = institution_repository

    def create_institution(self, new_institution: InstitutionCreate) -> int:
        return self.repository.create_institution(new_institution)

    def get_institution_by_id(self, institution_id: int) -> Institution:
        return self.repository.get_institution_by_id(institution_id)