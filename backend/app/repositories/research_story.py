import math
from typing import List
import random

from fastapi import Depends
from sqlmodel import select, Session
from sqlalchemy.exc import NoResultFound

from app.db import get_session
from app.models.research_story import ResearchStory, ResearchStoryCreate, ResearchStoryUpdate, ResearchStoryShortRead, \
    StoryTagLink, StoryLikeLink
from app.models.user import User
from app.models.tag import Tag, UserTagLink
from app.repositories.tag import get_tag_repository
from app.repositories.researcher import get_researcher_repository
from app.repositories.institution import get_institution_repository
from app.utils.model import assign_members_from_dict
from app.utils.exceptions import NonExistentEntry
from app.models.pagination import Page, Paginator
from app.core.trending_cache import get_cache_len, get_trending


class ResearchStoryRepository:
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

    def get_all(self, paginator: Paginator) -> Page[ResearchStoryShortRead]:
        query = select(ResearchStory)
        return Page[ResearchStoryShortRead](items=self.session.exec(paginator.paginate(query)).all(),
                                            page_count=paginator.get_page_count(self.session, query))

    def get_recommended(self, current_user_id: int, n: int) -> List[ResearchStory]:
        all_recommended_stories = (self.session.query(ResearchStory)
                                   .join(StoryTagLink, ResearchStory.id == StoryTagLink.story_id)
                                   .join(Tag, Tag.id == StoryTagLink.tag_id)
                                   .join(UserTagLink, UserTagLink.tag_id == Tag.id)
                                   .filter(UserTagLink.user_id == current_user_id)).all()
        if len(all_recommended_stories) < n:
            all_stories = self.session.exec(select(ResearchStory)).all()
            if len(all_stories) < n:
                return all_stories  # not enough overall stories to satisfy
            else:
                return random.sample(all_stories, n)  # not enough recommended stories to satisfy
        else:
            return random.sample(all_recommended_stories, n)  # enough recommended stories to satisfy

    def get_liked(self, current_user_id: int, paginator: Paginator):
        query = select(ResearchStory).join(ResearchStory.likes).where(
            StoryLikeLink.user_id == current_user_id).distinct()
        return Page[ResearchStoryShortRead](items=self.session.exec(paginator.paginate(query)).all(),
                                            page_count=paginator.get_page_count(self.session, query))

    def get_trending(self, paginator: Paginator) -> Page[ResearchStoryShortRead]:
        # could even move all the trending_cache.py stuff here...
        return Page[ResearchStoryShortRead](items=list(map(self.get, get_trending(paginator.page,
                                                                                  paginator.page_size))),
                                            page_count=math.ceil(get_cache_len() / paginator.page_size))

    def create(self, create_story: ResearchStoryCreate) -> ResearchStory:
        story = ResearchStory()
        assign_members_from_dict(story, create_story.dict(exclude_unset=True,
                                                          exclude={"authors", "institutions", "tags"}))
        story.researchers = [self.researcher_repository.get_researcher_by_id(r_id)
                             for r_id in create_story.authors]
        story.institutions = [self.institution_repository.get_institution_by_id(i_id)
                              for i_id in create_story.institutions]
        story.tags = [self.tag_repository.get_tag_by_id(t_id) for t_id in create_story.tags]
        self.session.add(story)
        self.session.commit()
        return story

    def update(self, story: ResearchStory, update_story: ResearchStoryUpdate) -> ResearchStory:
        assign_members_from_dict(story, update_story.dict(exclude_unset=True,
                                                          exclude={"authors", "institutions", "tags"}))
        story.researchers = [self.researcher_repository.get_researcher_by_id(r_id)
                             for r_id in update_story.authors]
        story.institutions = [self.institution_repository.get_institution_by_id(i_id)
                              for i_id in update_story.institutions]
        story.tags = [self.tag_repository.get_tag_by_id(t_id) for t_id in update_story.tags]
        self.session.add(story)
        self.session.commit()
        return story

    def delete(self, story_id: int):
        self.session.delete(self.get(story_id))
        self.session.commit()

    def set_story_like(self, current_user_id: int, story_id: int, liked: bool):
        try:
            story = self.session.exec(select(ResearchStory).where(ResearchStory.id == story_id)).one()
        except NoResultFound:
            raise NonExistentEntry('ResearchStory_id', story_id)
        # should be using user_repository here, but it doesn't work for some reason
        current_user = self.session.exec(select(User).where(User.id == current_user_id)).one()
        if liked and current_user not in story.likes:
            story.likes.append(current_user)
        elif not liked and current_user in story.likes:
            story.likes.remove(current_user)
        self.session.add(story)
        self.session.commit()

    def get_story_like(self, current_user_id: int, story_id: int) -> bool:
        try:
            story = self.session.exec(select(ResearchStory).where(ResearchStory.id == story_id)).one()
        except NoResultFound:
            raise NonExistentEntry('ResearchStory_id', story_id)
        # should be using user_repository here, but it doesn't work for some reason
        current_user = self.session.exec(select(User).where(User.id == current_user_id)).one()
        return current_user in story.likes

    def get_num_likes(self, story_id: int) -> int:
        try:
            story = self.session.exec(select(ResearchStory).where(ResearchStory.id == story_id)).one()
        except NoResultFound:
            raise NonExistentEntry('ResearchStory_id', story_id)
        return len(story.likes)


def get_researchstory_repository(session: Session = Depends(get_session)) -> ResearchStoryRepository:
    return ResearchStoryRepository(session)
