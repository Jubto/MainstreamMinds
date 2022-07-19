from typing import List

from fastapi import Depends
from sqlmodel import select, Session

from app.db import get_session
from app.repositories.base import BaseRepository
from app.models.institution import Institution, InstitutionRead
# TODO: verify what the ResearchStory object looks like
from app.models.research_story import ResearchStory


class InstitutionRepository(BaseRepository[Institution, Institution, Institution]):

    def get_institution(self, current_story_id: int) -> List[Institution]:
        pass
        # TODO
        # return self.session.exec(select(ResearchStory).where(ResearchStory.id == current_story_id)).one().institution_links

    # need to assess what info we want to pass in for an institution
    def add_institution(self, current_story_id: int, institution: str):
        pass
        # TODO
        # story = self.session.exec(select(ResearchStory).where(ResearchStory.id == current_story_id)).one()
        # db_institution = self.session.exec(select(Institution).where(Institution.name == institution)).one()
        # story.tag_links.append(db_institution)
        # self.session.commit()

    def create_institution(self, tag: InstitutionRead):
        pass
        # TODO
        # db_institution = Institution.from_orm(institution)
        # self.session.add(db_institution)
        # self.session.commit()


def get_institution_repository(session: Session = Depends(get_session)) -> InstitutionRepository:
    return InstitutionRepository(Institution, session)
