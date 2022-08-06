from enum import Enum
from typing import Optional, List

from app.core.security import is_researcher, get_request_user_id, is_consumer
from app.models.pagination import Page, Paginator, get_paginator
from app.core.trending_cache import get_trending, update_trending, get_cache_len

from fastapi import APIRouter, Depends, Path, Query, BackgroundTasks

from app.models.research_story import (
    ResearchStoryShortRead,
    ResearchStoryLongRead,
    ResearchStoryCreate, ResearchStoryUpdate,
)
from app.services.research_story import ResearchStoryService

router = APIRouter(tags=['story'])


class ordering(str, Enum):
    ASC = 'ascending'
    DESC = 'descending'


@router.get(
    "",
    response_model=Page[ResearchStoryShortRead]
)
async def get_stories_by_filters(
        authors: Optional[List[int]] = Query(default=None,
                                             description="Only return list which have these authors id's"),
        institutions: Optional[List[int]] = Query(default=None,
                                                  description="Only return list which have these institutions id's"),
        tags: Optional[List[str]] = Query(default=None, description='Only return list which contain these tags'),
        like_count: Optional[ordering] = Query(default=None, description='Order list by like count'),
        comment_count: Optional[ordering] = Query(default=None, description='Order list by comment count'),
        search: Optional[str] = Query(default=None,
                                      description='Generic search against story title, summary, content, transcript'),
        paginator: Paginator = Depends(get_paginator),
        story_service: ResearchStoryService = Depends()
):
    """
    Query the database based on the following filters, list of summarised story data is returned.
    If no filters are applied, random list of stories are returned
    """
    return story_service.get_all(paginator)


@router.get("/likes", response_model=int)
async def get_num_likes(
        story_id: int = Query(gt=0),
        story_service: ResearchStoryService = Depends(ResearchStoryService),
):
    """
    Returns the number of likes on a research story
    """
    return story_service.get_num_likes(story_id)


@router.get("/like", response_model=bool, dependencies=[Depends(is_consumer)])
async def get_story_like(
        story_id: int = Query(gt=0),
        story_service: ResearchStoryService = Depends(ResearchStoryService),
        current_user_id: int = Depends(get_request_user_id)
):
    """
    Returns true/false on whether the current user has liked a research story
    """
    return story_service.get_story_like(current_user_id, story_id)


# this could maybe be /{story_id}/like...
@router.put("/like", response_model=None, dependencies=[Depends(is_consumer)])
async def set_story_like(
        liked: bool,
        story_id: int = Query(gt=0),
        story_service: ResearchStoryService = Depends(ResearchStoryService),
        current_user_id: int = Depends(get_request_user_id)
):
    """
    Sets a story to either liked (true) or not liked (false) by the current user
    """
    story_service.set_story_like(current_user_id, story_id, liked)


@router.get(
    "/trending",
    response_model=Page[ResearchStoryShortRead]
)
async def get_trending_stories(
    paginator: Paginator = Depends(get_paginator),
    story_service: ResearchStoryService = Depends()
):
    """
    Returns list of the top n globally trending stories
    """
    return story_service.get_trending(paginator)


@router.get(
    "/recommendations",
    dependencies=[Depends(is_consumer)],
    response_model=List[ResearchStoryShortRead]
)
async def get_recommended(
        n: int = Query(gt=0),
        current_user_id: int = Depends(get_request_user_id),
        story_service: ResearchStoryService = Depends()
):
    """
    Returns a list of the top n recommended stories for the current user
    """
    return story_service.get_recommended(current_user_id, n)


@router.get(
    "/liked",
    dependencies=[Depends(is_consumer)],
    response_model=Page[ResearchStoryShortRead]
)
async def get_liked_stories(
        paginator: Paginator = Depends(get_paginator),
        current_user_id: int = Depends(get_request_user_id),
        story_service: ResearchStoryService = Depends()
):
    """
    Returns a list of the users liked stories
    """
    return story_service.get_liked(current_user_id, paginator)


@router.get(
    "/{story_id}",
    response_model=ResearchStoryLongRead
)
async def get_story_by_id(
    background_tasks: BackgroundTasks,
    story_id: int = Path(default=..., gt=0),
    story_service: ResearchStoryService = Depends(),
):
    """
    Return all information regarding a given research story'
    """
    ret = story_service.get(story_id)
    background_tasks.add_task(update_trending, story_id)
    return ret


@router.post(
    "",
    dependencies=[Depends(is_researcher)],
    response_model=ResearchStoryLongRead
)
async def post_story(
        create_story: ResearchStoryCreate,
        story_service: ResearchStoryService = Depends()
):
    """
    Create a new story in the database, only valid researchers can access this endpoint
    """
    return story_service.create(create_story)


@router.patch(
    "/{story_id}",
    response_model=ResearchStoryLongRead,
    dependencies=[Depends(is_researcher)]
)
async def update_story_by_id(
        update_story: ResearchStoryUpdate,
        story_id: int = Path(default=..., gt=0),
        jwt_derived_researcher_id: int = Depends(get_request_user_id),
        story_service: ResearchStoryService = Depends(ResearchStoryService)
):
    """
    Update an existing story in the database, only valid researchers who
    are authors of the story can access this endpoint
    """
    return story_service.update(story_id, jwt_derived_researcher_id, update_story)


@router.delete(
    "/{story_id}",
    dependencies=[Depends(is_researcher)]
)
async def delete_story_by_id(
        story_id: int = Path(default=..., gt=0),
        current_user_id: int = Depends(get_request_user_id),
        story_service: ResearchStoryService = Depends(ResearchStoryService)
):
    """
    Delete an existing story in the database, only valid researchers who are authors of the story can access
    this endpoint
    """
    return story_service.delete(current_user_id, story_id)
