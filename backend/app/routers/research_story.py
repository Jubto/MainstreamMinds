from enum import Enum
from typing import Optional, List

from fastapi import APIRouter, Depends, Path, Query

from app.core.security import get_request_user_id, is_consumer, is_researcher
from app.models.research_story import (
    ResearchStoryShortRead,
    ResearchStoryLongRead,
    ResearchStoryCreate,
    ResearchStoryUpdate,
    ResearchStoryResponse
)
from app.services.research_story import ResearchStoryService
from app.utils.exceptions import AuthorDetailsMissing


router = APIRouter(tags=['story'])

class ordering(str, Enum):
    ASC = 'ascending'
    DESC = 'descending'


@router.get(
    "",
    description='Query the database based on the following filters, list of summarised story data is returned. If no filters are applied, random list of stories are returned',
    response_model=List[ResearchStoryShortRead]
)
async def get_stories_by_filters(
    authors: Optional[List[int]] = Query(default=None, description="Only return list which have these authors id's"),
    institutions: Optional[List[int]] = Query(default=None, description="Only return list which have these institutions id's"),
    tags: Optional[List[str]] = Query(default=None, description='Only return list which contain these tags'),
    like_count: Optional[ordering] = Query(default=None, description='Order list by like count'),
    comment_count: Optional[ordering] = Query(default=None, description='Order list by comment count' ),
    search: Optional[str] = Query(default=None, description='Generic search against story title, summary, content, transcript'),
    page_size: int = Query(default=20, gt=0),
    page_num: int = Query(default=1, gt=0),
    story_service: ResearchStoryService = Depends()
):
    return story_service.get_all(page_size, page_num)


@router.get(
    "/trending",
    description='Returns list of globally recommended stories',
    response_model=List[ResearchStoryShortRead]
)
async def get_trending_stories(
    page_size: int = Query(default=20, gt=0),
    page_num: int = Query(default=1, gt=0),
    story_service: ResearchStoryService = Depends()
):
    return story_service.get_trending(page_size, page_num)


@router.get(
    "/recommendations",
    description='Provide the user_id of a valid account holder to recieve list of recommended stories for that user',
    response_model=List[ResearchStoryShortRead],
    dependencies=[Depends(is_consumer)]
)
async def get_recommended_stories(
    page_size: int = Query(default=20, gt=0),
    page_num: int = Query(default=1, gt=0),
    jwt_derived_user_id: int = Depends(get_request_user_id),
    story_service: ResearchStoryService = Depends()
):
    return story_service.get_recommendation(jwt_derived_user_id, page_size, page_num)


@router.get(
    "/{story_id}",
    description='Return all information regarding a given research story',
    response_model=ResearchStoryLongRead
)
async def get_story_by_id(
    story_id: int = Path(default=..., gt=0),
    story_service: ResearchStoryService = Depends()
):
    return story_service.get(story_id)


@router.post(
    "",
    description='Create a new story in the database, only valid researchers can access this endpoint',
    response_model=ResearchStoryResponse,
    # dependencies=[Depends(is_researcher)]
)
async def post_story(
    create_story: ResearchStoryCreate,
    jwt_derived_researcher_id: int = Depends(get_request_user_id),
    story_service: ResearchStoryService = Depends()
):
    # if not [author for author in create_story.authors if author.researcher_id == jwt_derived_researcher_id]:
    #     raise AuthorDetailsMissing TODO
    return story_service.create(create_story)


@router.patch(
    "/{story_id}",
    description='Update an existing story in the database, only valid researchers who are authors of the story can access this endpoint',
    response_model=ResearchStoryResponse,
    # dependencies=[Depends(is_researcher)] TODO
)
async def update_story_by_id(
    update_story: ResearchStoryUpdate,
    story_id: int = Path(default=..., gt=0),
    jwt_derived_researcher_id: int = Depends(get_request_user_id),
    story_service: ResearchStoryService = Depends()
):
    return story_service.update(story_id, jwt_derived_researcher_id, update_story)


@router.delete(
    "/{story_id}",
    description='Delete an existing story in the database, only valid researchers who are authors of the story can access this endpoint',
    # dependencies=[Depends(is_researcher)] TODO
)
async def delete_story_by_id(
    story_id: int = Path(default=..., gt=0),
    jwt_derived_researcher_id: int = Depends(get_request_user_id),
    story_service: ResearchStoryService = Depends()
):
    return story_service.delete(story_id, jwt_derived_researcher_id)

