from typing import Optional, List

from fastapi import APIRouter, Depends, Path, Query

from app.core.security import get_request_user_id, is_researcher, is_consumer, create_token
from app.models.exception import Message404
from app.models.security import TokenData
from app.models.pagination import Page, Paginator, get_paginator
from app.models.researcher import (
    ResearcherRead,
    ResearcherUpdate,
    ResearcherCreate,
    ResearcherCreated
)
from app.models.research_story import ResearchStoryShortRead
from app.services.researcher import ResearcherService

router = APIRouter(tags=['researcher'])


@router.get(
    "",
    description='Return all researchers from the database',
    response_model=List[ResearcherRead]
)
async def get_all_researchers(
        researcher_service: ResearcherService = Depends(ResearcherService)
):
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
    response_model=Page[ResearchStoryShortRead]
)
async def get_stories_by_researcher(
        researcher_id: int = Path(default=..., gt=0),
        paginator: Paginator = Depends(get_paginator),
        researcher_service: ResearcherService = Depends(ResearcherService)
):
    return researcher_service.get_stories_by_researcher(researcher_id, paginator)


@router.post(
    "",
    description='This will permanently upgrade an existing user to hold researcher privileges',
    response_model=ResearcherCreated,
    dependencies=[Depends(is_consumer)],
    responses={
        404: {"model": Message404, 'description': 'Returned if institution specified by institution_id does not exist'}}
)
async def upgrade_to_researcher(
        new_researcher: ResearcherCreate,
        current_user_id: int = Depends(get_request_user_id),
        researcher_service: ResearcherService = Depends(ResearcherService)
):
    researcher_id = researcher_service.upgrade(new_researcher, current_user_id)
    token = create_token(data=TokenData(sub=str(current_user_id), role=1))
    return {"researcher_id": researcher_id, "access_token": token, "token_type": "bearer"}


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
