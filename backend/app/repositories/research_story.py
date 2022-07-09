from typing import List

from fastapi import Depends
from sqlmodel import select, Session

from app.db import get_session
from app.models.research_story import ResearchStory
from app.models.user import User


class ResearchStoryRepository:
    model = ResearchStory

    def __init__(self, session: Session):
        super(ResearchStoryRepository, self).__init__(ResearchStory, session)


def get_researchstory_repository(session: Session = Depends(get_session)) -> ResearchStoryRepository:
    return ResearchStoryRepository(session)
