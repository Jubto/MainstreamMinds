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
    response_model=List[ResearcherRead]
)
async def get_all_researchers(
    researcher_service: ResearcherService = Depends(ResearcherService)
):
    """
    Gets all researchers from the database
    """
    return researcher_service.get_all()


@router.get(
    "/{researcher_id}",
    description='Returns details for a researcher given their id',
    response_model=ResearcherRead
)
async def get_researcher_by_id(
    researcher_id: int = Path(default=..., gt=0),
    researcher_service: ResearcherService = Depends(ResearcherService)
):
    return researcher_service.get_researcher_by_id(researcher_id)


@router.get(
    "/{researcher_id}/stories",
    description='Returns all stories (in short read form) associated with a researcher',
    response_model=List[ResearchStoryShortRead]
)
async def get_stories_by_researcher(
    researcher_id: int = Path(default=..., gt=0),
    researcher_service: ResearcherService = Depends(ResearcherService)
):
    return researcher_service.get_stories_by_researcher(researcher_id)


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
    "",
    description='Update the details of the current researcher',
    response_model=ResearcherRead,
    dependencies=[Depends(is_researcher)]
)
async def update_researcher(
    updated_details: ResearcherUpdate,
    current_user_id: int = Depends(get_request_user_id),
    researcher_service: ResearcherService = Depends(ResearcherService)
):
    return researcher_service.update_researcher(updated_details, current_user_id)
