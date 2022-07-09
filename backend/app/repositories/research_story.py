from typing import List

from fastapi import Depends
from sqlmodel import select, Session

from app.db import get_session
from app.models.research_story import ResearchStory, ResearchStoryShortRead, ResearchStoryLongRead, ResearchStoryCreate, ResearchStoryUpdate


class ResearchStoryRepository:

    def get_all(self, *args, offset: int, limit: int) -> List[ResearchStoryShortRead]:
        # combined general query
        pass

    def get_all_by_tag(self, offset: int, limit: int) -> List[ResearchStoryShortRead]:
        pass

    def get_all_by_author(self, offset: int, limit: int) -> List[ResearchStoryShortRead]:
        pass

    def get_all_by_institution(self, offset: int, limit: int) -> List[ResearchStoryShortRead]:
        pass

    def get(self, story_id: int) -> ResearchStoryLongRead:
        pass

    def create(self, story_id: int,  create_story: ResearchStoryCreate) -> ResearchStory:
        pass

    def update(self, story_id: int, update_story: ResearchStoryUpdate) -> ResearchStory:
        pass


def get_researchstory_repository(session: Session = Depends(get_session)) -> ResearchStoryRepository:
    return ResearchStoryRepository(ResearchStory, session)

