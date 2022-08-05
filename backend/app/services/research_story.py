from typing import List

from fastapi import Depends

from app.models.research_story import (
    ResearchStory,
    ResearchStoryShortRead, ResearchStoryCreate, ResearchStoryUpdate,
)
from app.repositories.research_story import ResearchStoryRepository, get_researchstory_repository
from app.utils.exceptions import AuthorDetailsMissing
from app.utils.model import ModelFieldsMapping
from app.models.pagination import Page, Paginator
from app.repositories.researcher import ResearcherRepository, get_researcher_repository


class ResearchStoryService:
    field_mappings: ModelFieldsMapping

    def __init__(self,
                 story_repository: ResearchStoryRepository = Depends(
                     get_researchstory_repository),
                 researcher_repository: ResearcherRepository = Depends(get_researcher_repository)
                 ):
        self.repository = story_repository
        self.researcher_repository = researcher_repository
        self.field_mappings = ModelFieldsMapping()

    def get_all(self, paginator: Paginator) -> Page[ResearchStoryShortRead]:
        return self.repository.get_all(paginator)

    def get(self, story_id: int) -> ResearchStory:
        return self.repository.get(story_id)

    def get_recommended(self, current_user_id: int, n: int) -> List[ResearchStory]:
        return self.repository.get_recommended(current_user_id, n)

    def get_trending(self, paginator: Paginator) -> Page[ResearchStoryShortRead]:
        return self.repository.get_trending(paginator)

    def create(self, create_story: ResearchStoryCreate) -> ResearchStory:
        return self.repository.create(create_story)

    def update(self, story_id: int, current_user_id: int, update_story: ResearchStoryUpdate) -> ResearchStory:
        researcher = self.researcher_repository.get_researcher_by_user_id(current_user_id)
        story = self.repository.get(story_id)
        if not [author for author in story.researchers if author.id == researcher.id]:
            raise AuthorDetailsMissing
        return self.repository.update(story, update_story)

    def delete(self, current_user_id: int, story_id: int) -> int:
        researcher = self.researcher_repository.get_researcher_by_user_id(current_user_id)
        story = self.repository.get(story_id)
        if not [author for author in story.researchers if author.id == researcher.id]:
            raise AuthorDetailsMissing
        self.repository.delete(story_id)
        return story.id

    def set_story_like(self, current_user_id: int, story_id: int, liked: bool):
        self.repository.set_story_like(current_user_id, story_id, liked)

    def get_story_like(self, current_user_id: int, story_id: int) -> bool:
        return self.repository.get_story_like(current_user_id, story_id)

    def get_num_likes(self, story_id: int) -> int:
        return self.repository.get_num_likes(story_id)
