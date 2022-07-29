from typing import Optional, List

from fastapi import APIRouter, Depends, Path, Query

from app.core.security import get_request_user_id, is_researcher, is_consumer
from app.models.researcher import (
    ResearcherRead,
    ResearcherUpdate,
    ResearcherCreate
)
from app.models.research_story import ResearchStoryShortRead
from app.services.researcher import ResearcherService

router = APIRouter(tags=['researcher'])

@router.get(
    "",
    description='Queries the database returning a list of researchers acording to any filters applied.',
    response_model=List[ResearcherRead]
)
async def get_researchers_by_filter(
    name: Optional[str] = Query(default=None, description="Only return list of researchers with this name"),
    tags: Optional[List[str]] = Query(default=None, description='Only return a list of researchers associated with this tag'),
):
    return None


@router.get(
    "/{researcher_id}",
    description='Returns details for the specified researcher',
    response_model=ResearcherRead
)
async def get_researcher_by_id(
    researcher_id: int = Path(default=..., gt=0),
    researcher_service: ResearcherService = Depends(ResearcherService)
):
    return researcher_service.get_researcher_by_id(researcher_id)


@router.get(
    "/{story_id}/stories",
    description='Returns all stories assoicated with a researcher',
    response_model=List[ResearchStoryShortRead]
)
async def get_researcher_stories(
    researcher_id: int = Path(default=..., gt=0),
):
    return None


@router.post(
    "",
    description='This will permanently upgrade an existing user to hold researcher privileges',
    response_model=int,
    dependencies=[Depends(is_consumer)]
)
async def upgrade_to_researcher(
    new_researcher: ResearcherCreate,
    current_user_id: int = Depends(get_request_user_id),
    researcher_service: ResearcherService = Depends(ResearcherService)
):
    return researcher_service.upgrade(new_researcher, current_user_id)


@router.patch(
    "/{researcher_id}",
    description='Update details concerning researcher profile',
    response_model=ResearcherCreate,
    dependencies=[Depends(is_researcher)]
)
async def update_researcher_by_id(
    update_researcher: ResearcherUpdate,
    researcher_id: int = Path(default=..., gt=0),
    jwt_derived_researcher_id: int = Depends(get_request_user_id),
):
    return None


