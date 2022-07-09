from typing import List

from fastapi import Depends

from app.models.research_story import ResearchStory, ResearchStoryShortRead, ResearchStoryLongRead, ResearchStoryCreate, ResearchStoryUpdate
from app.repositories.research_story import ResearchStoryRepository, get_researchstory_repository
from app.utils.model import ModelFieldsMapping


class ResearchStoryService:

    field_mappings: ModelFieldsMapping

    def __init__(self,
                 story_repository: ResearchStoryRepository = Depends(get_researchstory_repository),
                 ):
        self.repository = story_repository
        self.field_mappings = ModelFieldsMapping()
    
    def get_all(self, *args, offset: int, limit: int) -> List[ResearchStoryShortRead]:
        self.repository.get_all()

    def get_trending(self, offset: int, limit: int) -> List[ResearchStoryShortRead]:
        # comptue trending logic
        self.repository.get_all()

    def get_recommendation(self, user_it: int, offset: int, limit: int) -> List[ResearchStoryShortRead]:
        # comptue trending logic
        self.repository.get_all()

    def get(self, story_id: int) -> ResearchStoryLongRead:
        self.repository.get(story_id)

    def create(self, create_story: ResearchStoryCreate) -> ResearchStory:
        self.repository.create(create_story)

    def update(self, story_id: int, update_story: ResearchStoryUpdate) -> ResearchStory:
        self.repository.update(story_id, update_story)
