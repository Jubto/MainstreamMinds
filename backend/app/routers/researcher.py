from typing import List

from fastapi import APIRouter, Depends, Path

from app.core.security import get_request_user_id, is_researcher, is_consumer, create_token
from app.models.filter import ModelFilter, FieldFilter, FilterOperation, FilterCompoundOperation, FilterCompound, \
    FilterExpression
from app.models.security import TokenData
from app.models.pagination import Page, Paginator, get_paginator
from app.models.researcher import (
    ResearcherRead,
    ResearcherUpdate,
    ResearcherCreate,
    ResearcherCreated,
    Researcher
)
from app.models.research_story import ResearchStoryShortRead
from app.models.tag import Tag
from app.models.user import User
from app.services.researcher import ResearcherService

router = APIRouter(tags=['researcher'])


@router.get(
    "",
    description='Return all researchers from the database',
    response_model=List[ResearcherRead]
)
async def get_all_researchers(
        tags: List[str] = Query(default=None, description='A list of tag names to filter by'),
        search: str = Query(default=None, description='Filter researchers by first and last name'),
        researcher_service: ResearcherService = Depends(ResearcherService)
):
    filter_by: Optional[ModelFilter[Researcher]] = None
    filters = []
    if search:
        first_name_filter = FieldFilter(field='first_name', operation=FilterOperation.ILIKE, value=search,
                                        model=User)
        last_name_filter = FieldFilter(field='last_name', operation=FilterOperation.ILIKE, value=search,
                                       model=User)
        filters.append(
            FilterCompound(filters=[first_name_filter, last_name_filter], operator=FilterCompoundOperation.OR))

    if tags:
        filters.append(FieldFilter(field='name', operation=FilterOperation.IN, value=tags, model=Tag))

    if filters:
        compound = FilterCompound(filters=filters, operator=FilterCompoundOperation.AND)
        filter_by = ModelFilter(FilterExpression(compound), User)

    return researcher_service.get_all(filter_by)


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
