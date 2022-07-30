from enum import Enum
from typing import Optional, List

from app.core.security import is_researcher, get_request_user_id, is_consumer
from app.models.pagination import Page, Paginator, get_paginator

from fastapi import APIRouter, Depends, Path, Query

from app.models.research_story import (
    ResearchStory,
    ResearchStoryShortRead,
    ResearchStoryLongRead,
    ResearchStoryCreate, ResearchStoryUpdate,
    # ResearchStoryUpdate,
    # ResearchStoryResponse
)
from app.services.research_story import ResearchStoryService


router = APIRouter(tags=['story'])


class ordering(str, Enum):
    ASC = 'ascending'
    DESC = 'descending'


@router.get(
    "",
    response_model=List[ResearchStoryShortRead]
)
async def get_stories_by_filters(
    authors: Optional[List[int]] = Query(default=None, description="Only return list which have these authors id's"),
    institutions: Optional[List[int]] = Query(default=None, description="Only return list which have these institutions id's"),
    tags: Optional[List[str]] = Query(default=None, description='Only return list which contain these tags'),
    like_count: Optional[ordering] = Query(default=None, description='Order list by like count'),
    comment_count: Optional[ordering] = Query(default=None, description='Order list by comment count' ),
    search: Optional[str] = Query(default=None, description='Generic search against story title, summary, content, transcript'),
    paginator: Paginator = Depends(get_paginator),
    story_service: ResearchStoryService = Depends()
):
    """
    Query the database based on the following filters, list of summarised story data is returned.
    If no filters are applied, random list of stories are returned
    """
    return story_service.get_all(paginator)


@router.get(
    "/trending",
    response_model=List[ResearchStoryShortRead]
)
async def get_trending_stories(
    paginator: Paginator = Depends(get_paginator),
    story_service: ResearchStoryService = Depends()
):
    """
    Returns list of globally recommended stories
    """
    return story_service.get_all(paginator)


@router.get(
    "/recommendations",
    response_model=List[ResearchStoryShortRead],
    dependencies=[Depends(is_consumer)]
)
async def get_recommended_stories(
        paginator: Paginator = Depends(get_paginator),
        story_service: ResearchStoryService = Depends()
):
    """
    Provide the user_id of a valid account holder to receive list of recommended stories for that user
    """
    return story_service.get_all(paginator)


@router.get(
    "/{story_id}",
    response_model=ResearchStoryLongRead
)
async def get_story_by_id(
    story_id: int = Path(default=..., gt=0),
    story_service: ResearchStoryService = Depends()
):
    """
    Return all information regarding a given research story'
    """
    return story_service.get(story_id)


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
    response_model=ResearchStory,
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
    return story_service.delete(story_id, current_user_id)
