from typing import List

from fastapi import Depends
from sqlmodel import select, Session

from app.db import get_session
from app.repositories.base import BaseRepository
from app.models.institution import Institution, InstitutionRead
# TODO: verify what the ResearchStory object looks like
from app.models.story import ResearchStory


class InstitutionRepository(BaseRepository[Institution]):
    def __init__(self, session: Session):
        self.session = session

    def get_institution(self, current_story_id: int) -> List[Institution]:
        return self.session.exec(select(ResearchStory).where(ResearchStory.id == current_story_id)).one().institution_links

    # need to assess what info we want to pass in for an institution
    def add_institution(self, current_story_id: int, institution: str):
        pass

    def create_institution(self, tag: InstitutionRead):
        pass

def get_institution_repository(session: Session = Depends(get_session)) -> InstitutionRepository:
    return InstitutionRepository(session)
