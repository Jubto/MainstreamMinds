from typing import List

from fastapi import Depends

from app.models.research_story import (
    ResearchStory,
    ResearchStoryShortRead,
    ResearchStoryLongRead,
    ResearchStoryCreate,
    ResearchStoryUpdate
)
from app.repositories.research_story import ResearchStoryRepository, get_researchstory_repository
from app.utils.model import ModelFieldsMapping
from app.utils.exceptions import AuthorDetailsMissing


class ResearchStoryService:

    field_mappings: ModelFieldsMapping

    def __init__(self,
                 story_repository: ResearchStoryRepository = Depends(
                     get_researchstory_repository),
                 ):
        self.repository = story_repository
        self.field_mappings = ModelFieldsMapping()

    def get_all(self, offset: int, limit: int) -> List[ResearchStoryShortRead]:
        return [ResearchStoryShortRead(
            id=story.id,
            title=story.title,
            summary=story.summary,
            authors=[{'researcher_id': 1, 'institution_id': 3}],
            tags=[{'tag_id': tag.id, 'name': tag.name} for tag in story.tags],
            thumbnail=story.thumbnail,
            video_link=story.video_link,
            like_count=len(story.likes)
        )
            for story in self.repository.get_all(offset, limit)
        ]

    def get_trending(self, offset: int, limit: int) -> List[ResearchStoryShortRead]:
        # comptue trending logic
        self.get_all(offset, limit)

    def get_recommendation(self, user_it: int, offset: int, limit: int) -> List[ResearchStoryShortRead]:
        # comptue trending logic
        self.get_all(offset, limit)

    def get(self, story_id: int) -> ResearchStoryLongRead:
        return self._populate_long_read(self.repository.get(story_id))

    def create(self, create_story: ResearchStoryCreate) -> ResearchStoryLongRead:
        return self._populate_long_read(self.repository.create(create_story))

    def update(self, story_id: int, researcher_id: int, update_story: ResearchStoryUpdate) -> ResearchStoryLongRead:
        story = self.repository.get(story_id)
        # if not [author for author in story.researchers if author.researcher_id == researcher_id]:
        #     raise AuthorDetailsMissing TODO: wait for researcher authentication
        return self._populate_long_read(self.repository.update(story, update_story))

    def delete(self, story_id: int, researcher_id: int) -> str:
        story = self.repository.get(story_id)
        # if not [author for author in story.researchers if author.researcher_id == researcher_id]:
        #     raise AuthorDetailsMissing TODO: wait for researcher authentication
        self.repository.delete(story_id)
        return {'Msg': f'story_id {story_id} has been deleted from the database'}

    @staticmethod
    def _populate_long_read(story: ResearchStory) -> ResearchStoryLongRead:
        return ResearchStoryLongRead(
            id=story.id,
            title=story.title,
            summary=story.summary,
            papers=story.papers,
            content_body=story.content_body,
            thumbnail=story.thumbnail,
            video_link=story.video_link,
            transcript=story.transcript,
            authors=[{'researcher_id': 1, 'institution_id': 3}],
            tags=[{'tag_id': tag.id, 'name': tag.name} for tag in story.tags],
            like_count=len(story.likes),
            like_list=[{'user_id': user.id, 'user_email': user.email}
                       for user in story.likes],
            comment_count=3
        )
