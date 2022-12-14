from typing import List, Optional

from fastapi import APIRouter, Depends, Path, Query

from app.core.security import get_request_user_id, is_researcher, is_consumer, create_token
from app.models.exception import HTTPExceptionResponse
from app.models.filter import ModelFilter, FieldFilter, FilterOperation, FilterCompoundOperation, FilterCompound, \
    FilterExpression
from app.models.pagination import Page, Paginator, get_paginator
from app.models.research_story import ResearchStoryShortRead
from app.models.researcher import (
    ResearcherRead,
    ResearcherUpdate,
    ResearcherCreate,
    ResearcherCreated,
    Researcher
)
from app.models.security import TokenData
from app.models.tag import Tag
from app.models.user import User
from app.services.researcher import ResearcherService

router = APIRouter(tags=['researcher'])


@router.get("",
            response_model=Page[ResearcherRead]
            )
async def get_all_researchers(
        tags: List[str] = Query(default=None, description='A list of tag names to filter by'),
        search: str = Query(default=None, description='Filter researchers by first and last name'),
        paginator: Paginator = Depends(get_paginator),
        researcher_service: ResearcherService = Depends(ResearcherService)
):
    """
    Return all researchers from the database
    """
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
        tag_filters = []
        for tag in tags:
            tag_filters.append(FieldFilter(field='name', operation=FilterOperation.CONTAINS, value=tag, model=Tag,
                                           relationship_field=User.preference_tags))
        filters.append(FilterCompound(filters=tag_filters, operator=FilterCompoundOperation.AND))

    if filters:
        compound = FilterCompound(filters=filters, operator=FilterCompoundOperation.AND)
        filter_by = ModelFilter(FilterExpression(compound), User)

    return researcher_service.get_all(filter_by, paginator)


@router.get("/me",
            response_model=ResearcherRead
            )
async def get_current_researcher(
        current_user_id: int = Depends(get_request_user_id),
        researcher_service: ResearcherService = Depends(ResearcherService)
):
    """
    Return details for the current researcher
    """
    return researcher_service.get_researcher_by_user_id(current_user_id)


@router.get("/from_user/{user_id}",
            description='',
            response_model=ResearcherRead
            )
async def get_researcher_by_user_id(
        user_id: int = Path(default=..., gt=0),
        researcher_service: ResearcherService = Depends(ResearcherService)
):
    """
    Return details for a researcher given their user id 
    Return 404 if no researcher found
    """
    return researcher_service.get_researcher_by_user_id(user_id)


@router.get("/{researcher_id}",
            response_model=ResearcherRead
            )
async def get_researcher_by_id(
        researcher_id: int = Path(default=..., gt=0),
        researcher_service: ResearcherService = Depends(ResearcherService)
):
    """
    Return details for a researcher given their id
    """
    return researcher_service.get_researcher_by_id(researcher_id)


@router.get("/{researcher_id}/stories",
            response_model=Page[ResearchStoryShortRead]
            )
async def get_stories_by_researcher(
        researcher_id: int = Path(default=..., gt=0),
        paginator: Paginator = Depends(get_paginator),
        researcher_service: ResearcherService = Depends(ResearcherService)
):
    """
    Return all stories (in short read form) associated with a researcher
    """
    return researcher_service.get_stories_by_researcher(researcher_id, paginator)


@router.post("",
             response_model=ResearcherCreated,
             dependencies=[Depends(is_consumer)],
             responses={
                 404: {"model": HTTPExceptionResponse,
                       'description': 'Returned if institution specified by institution_id does not exist'}}
             )
async def upgrade_to_researcher(
        new_researcher: ResearcherCreate,
        current_user_id: int = Depends(get_request_user_id),
        researcher_service: ResearcherService = Depends(ResearcherService)
):
    """
    Permanently upgrade an existing user to hold researcher privileges
    """
    researcher_id = researcher_service.upgrade(new_researcher, current_user_id)
    token = create_token(data=TokenData(sub=str(current_user_id), role=1))
    return {"researcher_id": researcher_id, "access_token": token, "token_type": "bearer"}


@router.patch("",
              response_model=ResearcherRead,
              dependencies=[Depends(is_researcher)]
              )
async def update_researcher(
        updated_details: ResearcherUpdate,
        current_user_id: int = Depends(get_request_user_id),
        researcher_service: ResearcherService = Depends(ResearcherService)
):
    """
    Update the details of the current researcher
    """
    return researcher_service.update_researcher(updated_details, current_user_id)
