from typing import List

from fastapi import Depends
from sqlmodel import select, Session

from app.db import get_session
from app.models.research_story import (
    ResearchStory,
    ResearchStoryShortRead,
    ResearchStoryLongRead,
    ResearchStoryCreate,
    ResearchStoryUpdate,
    ResearchStoryAuthor,
    ResearchStoryPaper,
    ResearchStorytags
)
from app.models.tag import Tag
from app.repositories.base import BaseRepository
from app.utils.model import assign_members_from_dict, ModelFieldsMapping

class ResearchStoryRepository(BaseRepository[ResearchStory, ResearchStoryUpdate, ResearchStoryCreate]):

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

    def create(self, create_story: ResearchStoryCreate) -> ResearchStory:
        story_model = ResearchStory()

        create_dict: dict = create_story.dict()
        authors: ResearchStoryAuthor = create_dict.pop("authors")
        tags: ResearchStorytags = create_dict.pop("tags")
        papers: ResearchStoryPaper = create_dict.pop("papers") # temp
        create_dict["papers"] = ','.join([paper['paper_title'] for paper in papers]) # temp
        assign_members_from_dict(story_model, create_dict)

        story_model.tag_links = [row for tag in tags if (row := self.session.exec(select(Tag).where(Tag.id == tag['tag_id'])).first())]
        # story_model.researcher_links = [row for author in authors if (row := self.session.exec(select(Researcher).where(Researcher.id == author['researcher_id'])).first())]
        # story_model.institution_links = [row for author in authors if (row := self.session.exec(select(Institute).where(Institute.id == author['institution_id'])).first())]
        self.session.add(story_model)
        self.session.commit()

    def update(self, story_id: int, update_story: ResearchStoryUpdate) -> ResearchStory:
        pass



def get_researchstory_repository(session: Session = Depends(get_session)) -> ResearchStoryRepository:
    return ResearchStoryRepository(ResearchStory, session)

