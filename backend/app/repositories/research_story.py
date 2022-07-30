from typing import List

from fastapi import Depends
from sqlmodel import select, Session
from sqlalchemy.exc import NoResultFound

from app.db import get_session
from app.models.research_story import ResearchStory, ResearchStoryCreate, ResearchStoryUpdate
from app.repositories.base import BaseRepository
from app.repositories.tag import get_tag_repository
from app.repositories.researcher import get_researcher_repository, ResearcherRepository
from app.repositories.institution import get_institution_repository
from app.utils.model import assign_members_from_dict
from app.utils.exceptions import NonExistentEntry
from app.models.pagination import Page, Paginator


class ResearchStoryRepository():
    def __init__(self, session: Session):
        self.session = session
        self.researcher_repository = get_researcher_repository(session)
        self.institution_repository = get_institution_repository(session)
        self.tag_repository = get_tag_repository(session)

    def get(self, story_id: int) -> ResearchStory:
        try:
            return self.session.exec(select(ResearchStory).where(ResearchStory.id == story_id)).one()
        except NoResultFound:
            raise NonExistentEntry('ResearchStory_id', story_id)

    def get_all(self, paginator: Paginator) -> List[ResearchStory]:
        # broken - doesn't return the researchers in each story for some reason
        # query = select(ResearchStory)
        # return Page[ResearchStory](items=self.session.exec(paginator.paginate(query)).all(),
        #                            page_count=math.ceil(len(self.session.exec(query).all()) / paginator.page_count))
        return self.session.exec(select(ResearchStory)).all()

    def create(self, create_story: ResearchStoryCreate) -> ResearchStory:
        story = ResearchStory()
        assign_members_from_dict(story, create_story.dict(exclude_unset=True, exclude={"authors", "institutions", "tags"}))
        story.researchers = [self.researcher_repository.get_researcher_by_id(r_id) for r_id in create_story.authors]
        story.institutions = [self.institution_repository.get_institution_by_id(i_id) for i_id in create_story.institutions]
        story.tags = [self.tag_repository.get_tag_by_id(t_id) for t_id in create_story.tags]
        self.session.add(story)
        self.session.commit()
        return story

    def update(self, story: ResearchStory, update_story: ResearchStoryUpdate) -> ResearchStory:
        assign_members_from_dict(story, update_story.dict(exclude_unset=True, exclude={"authors", "institutions", "tags"}))
        # this is taking in a different format compared to what get() spits out - so probably need to change up a bit
        story.researchers = [self.researcher_repository.get_researcher_by_id(r_id) for r_id in update_story.authors]
        story.institutions = [self.institution_repository.get_institution_by_id(i_id) for i_id in update_story.institutions]
        story.tags = [self.tag_repository.get_tag_by_id(t_id) for t_id in update_story.tags]
        self.session.add(story)
        self.session.commit()
        return story

    def delete(self, story_id: int):
        self.session.delete(self.get(story_id))
        self.session.commit()


def get_researchstory_repository(session: Session = Depends(get_session)) -> ResearchStoryRepository:
    return ResearchStoryRepository(session)
