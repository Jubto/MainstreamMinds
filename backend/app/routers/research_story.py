import enum
from typing import Optional, List

from fastapi import APIRouter, Depends, Path, Query

from app.core.security import get_request_user_id, is_consumer, is_researcher
from app.models.research_story import ResearchStory, ResearchStoryShortRead, ResearchStoryLongRead, ResearchStoryCreate, ResearchStoryUpdate
from app.services.research_story import ResearchStoryService

router = APIRouter(tags=['story'])

class ordering(int, enum.Enum):
    ASC = 'ASC'
    DESC = 'DESC'

# GET /research_stories/{story_id}/transcript

# GET /research_stories -
# param: Author, Institution, Tags, likes [asc, desc], comments [asc, desc], page_num, page_size
# search (generic - title, summary, content, transcript),
@router.get("/research_stories", response_model=List[ResearchStoryShortRead])
async def get_stories_by_filters(
    authors: List[str] = Query(None),
    institutions: List[str] = Query(None),
    tags: List[str] = Query(None),
    likes: ordering = Query(None),
    page_size: int = Query(default=10),
    page_num: int = Query(default=1),
    story_service: ResearchStoryService = Depends()
):
    return story_service.get_all(page_size, page_num)


@router.get("/research_stories/trending", response_model=List[ResearchStoryShortRead])
async def get_stories_by_filters(
    page_size: int = 10,
    page_num: int = 1,
    story_service: ResearchStoryService = Depends()
):
    return story_service.get_trending(page_size, page_num)


@router.get(
    "/research_stories/recommendations/{user_id}",
    response_model=List[ResearchStoryShortRead],
    dependencies=[Depends(is_consumer)]
)
async def get_stories_by_filters(
    user_id: int,
    page_size: int = 10,
    page_num: int = 1,
    jwt_derived_user_id: int = Depends(get_request_user_id),
    story_service: ResearchStoryService = Depends()
):
    if jwt_derived_user_id != user_id:
        return 'error'
    return story_service.get_recommendation(user_id, page_size, page_num)


@router.get("/research_stories/{story_id}", response_model=ResearchStoryLongRead)
async def get_story_by_id(
    story_id: int,
    story_service: ResearchStoryService = Depends()
):
    return story_service.get(story_id)


@router.post(
    "/research_stories",
    response_model=ResearchStory,
    dependencies=[Depends(is_researcher)]
)
async def get_story_by_id(
    create_story: ResearchStoryCreate,
    story_service: ResearchStoryService = Depends()
):
    return story_service.create(create_story)


@router.put(
    "/research_stories/{story_id}",
    response_model=ResearchStory,
    dependencies=[Depends(is_researcher)]
)
async def get_story_by_id(
    story_id: int,
    update_story: ResearchStoryUpdate,
    story_service: ResearchStoryService = Depends()
):
    return story_service.update(story_id, update_story)


@router.delete("/research_stories/{story_id}", dependencies=[Depends(is_researcher)])
async def get_story_by_id(
    story_id: int,
    story_service: ResearchStoryService = Depends()
):
    return story_service.delete(story_id)

