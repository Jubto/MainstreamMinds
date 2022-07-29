from typing import List, Optional

from fastapi import Depends

from app.models.pagination import Page, Paginator
from app.models.sorting import SortByFields
from app.models.filter import ModelFilter
from app.models.researcher import ResearcherCreate, ResearcherRead, Researcher
from app.repositories.researcher import ResearcherRepository, get_researcher_repository


class ResearcherService:
    #field_mappings: ModelFieldsMapping

    def __init__(self,
                 researcher_repository: ResearcherRepository = Depends(get_researcher_repository),
                 ):
        self.repository = researcher_repository

    def upgrade(self, new_researcher: ResearcherCreate, current_user_id: int) -> int:
        return self.repository.add_researcher(new_researcher, current_user_id)

    def get_researcher_by_id(self, researcher_id: int) -> Researcher:
        return self.repository.get_researcher_by_id(researcher_id)
