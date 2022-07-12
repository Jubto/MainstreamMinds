from typing import List

from fastapi import Depends
from sqlmodel import select, Session
from sqlalchemy.exc import NoResultFound

from app.db import get_session
from app.models.research_story import ResearchStory, ResearchStoryCreate, ResearchStoryUpdate
from app.models.tag import Tag
from app.repositories.base import BaseRepository, ModelT
from app.utils.model import assign_members_from_dict
from app.utils.exceptions import NonExistentResearchStory


class ResearchStoryRepository(BaseRepository[ResearchStory, ResearchStoryUpdate, ResearchStoryCreate]):

    def get_all(self, offset: int, limit: int) -> List[ResearchStory]:
        return self.session.exec(select(ResearchStory)).all() # TEMP TODO filtering etc

    def get_all_by_tag(self, offset: int, limit: int) -> List[ResearchStory]:
        pass

    def get_all_by_author(self, offset: int, limit: int) -> List[ResearchStory]:
        pass

    def get_all_by_institution(self, offset: int, limit: int) -> List[ResearchStory]:
        pass

    def get(self, story_id: int) -> ResearchStory:
        try:
            return self.session.exec(select(ResearchStory).where(ResearchStory.id == story_id)).one()
        except NoResultFound:
            raise NonExistentResearchStory

    def create(self, create_story: ResearchStoryCreate) -> ResearchStory:
        story = ResearchStory()
        create_template: dict = create_story.dict()
        create_template.pop("authors")
        create_template.pop("tags")

        # TODO TEMP: SQLite cannot handle lists, so convert to string for now in order to store in db
        papers = create_template.pop("papers") 
        create_template["papers"] = ','.join([paper['paper_title'] for paper in papers])

        # populate new story and m-to-m linked tables
        assign_members_from_dict(story, create_template)
        story.tags = self._get_rows(Tag, create_story.tags, 'name')
        # story_model.researchers = self._get_rows(Researcher, create_story.authors, 'researcher_id') #TODO wait for merge
        # story_model.institutions = self._get_rows(Institute, create_story.authors, 'institution_id') #TODO wait for merge
        self.session.add(story)
        self.session.commit()
        return story

    def update(self, story: ResearchStory, update_story: ResearchStoryUpdate) -> ResearchStory:
        update_template = update_story.dict(exclude_unset=True)
        update_authors = update_template.pop("authors", None)
        update_papers = update_template.pop("papers", None) # TEMP TODO postgres
        update_tags = update_template.pop("tags", None)
        assign_members_from_dict(story, update_template)

        # if update_authors:
            # story.authors = self._get_rows(Tag, update_story.authors, 'researcher_id') TODO wait for merge
        if update_papers:
            story.papers = ','.join([paper.paper_title for paper in update_story.papers]) # TEMP SQlite cannot handle lists
        if update_tags:
            story.tags = self._get_rows(Tag, update_story.tags, 'name')

        self.session.add(story)
        self.session.commit()
        return story

    def _get_rows(self, table: ModelT, items: list, key: str) -> List[ModelT]:
        return [row for item in items if (row := self.session.exec(select(table).where(table.name == getattr(item, key))).first())]


def get_researchstory_repository(session: Session = Depends(get_session)) -> ResearchStoryRepository:
    return ResearchStoryRepository(ResearchStory, session)
