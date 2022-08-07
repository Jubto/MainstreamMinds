from fastapi import Depends

from app.models.institution import Institution, InstitutionRead, InstitutionCreate, InstitutionUpdate
from app.models.pagination import Paginator, Page
from app.models.researcher import Researcher
from app.models.research_story import ResearchStoryShortRead
from app.repositories.institution import InstitutionRepository, get_institution_repository


class InstitutionService:
    def __init__(self,
                 institution_repository: InstitutionRepository = Depends(get_institution_repository)
                 ):
        self.repository = institution_repository

    def get_institutions(self, paginator: Paginator) -> Page[InstitutionRead]:
        return self.repository.get_institutions(paginator)

    def get_institution_by_id(self, institution_id: int) -> Institution:
        return self.repository.get_institution_by_id(institution_id)

    def update_institution(self, new_institution: InstitutionUpdate, institution_id: int) -> int:
        return self.repository.update_institution(new_institution, institution_id)

    def create_institution(self, new_institution: InstitutionCreate) -> int:
        return self.repository.create_institution(new_institution)

    def delete_institution(self, institution_id: int):
        return self.repository.delete_institution(institution_id)

    def get_institution_researchers(self, paginator: Paginator, institution_id: int) -> Page[Researcher]:
        return self.repository.get_institution_researchers(paginator, institution_id)

    def get_institution_stories(self, paginator: Paginator, institution_id: int) -> Page[ResearchStoryShortRead]:
        return self.repository.get_institution_stories(paginator, institution_id)
