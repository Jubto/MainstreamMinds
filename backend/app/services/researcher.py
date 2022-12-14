from typing import Optional

from fastapi import Depends

from app.models.filter import ModelFilter
from app.models.pagination import Paginator, Page
from app.models.research_story import ResearchStoryShortRead
from app.models.researcher import ResearcherCreate, ResearcherUpdate, Researcher, ResearcherRead
from app.models.user import Role
from app.repositories.researcher import ResearcherRepository, get_researcher_repository
from app.repositories.user import UserRepository, get_user_repository


class ResearcherService:
    def __init__(self,
                 researcher_repository: ResearcherRepository = Depends(get_researcher_repository),
                 user_repository: UserRepository = Depends(get_user_repository)
                 ):
        self.repository = researcher_repository
        self.user_repository = user_repository

    def upgrade(self, new_researcher: ResearcherCreate, current_user_id: int) -> int:
        researcher_id = self.repository.add_researcher(new_researcher, current_user_id)
        self.user_repository.update_role(current_user_id, Role.RESEARCHER)
        return researcher_id

    def get_researcher_by_user_id(self, user_id: int) -> Researcher:
        return self.repository.get_researcher_by_user_id(user_id)

    def get_all(self, filter_by: Optional[ModelFilter[Researcher]], paginator: Paginator) -> Page[ResearcherRead]:
        return self.repository.get_all(filter_by, paginator)

    def get_researcher_by_id(self, researcher_id: int) -> Researcher:
        return self.repository.get_researcher_by_id(researcher_id)

    def update_researcher(self, updated_details: ResearcherUpdate, current_user_id: int) -> Researcher:
        return self.repository.update_researcher(updated_details, current_user_id)

    def get_stories_by_researcher(self, researcher_id: int, paginator: Paginator) -> Page[ResearchStoryShortRead]:
        return self.repository.get_stories_by_researcher(researcher_id, paginator)
