from app.models.research_story import ResearchStory
from fastapi import APIRouter, Depends, Path

from app.core.security import get_request_user_id, is_consumer, is_researcher
from app.models.institution import InstitutionRead, InstitutionCreate, InstitutionUpdate
from app.models.pagination import Page, Paginator, get_paginator
from app.services.institution import InstitutionService
from app.models.researcher import Researcher
from app.models.research_story import ResearchStoryShortRead

router = APIRouter(tags=['institution'])


@router.get(
    "/", 
    description='Returns all institutions in the database',
    response_model=Page[InstitutionRead], 
)
async def get_institutions(
        paginator: Paginator = Depends(get_paginator),
        institution_service: InstitutionService = Depends(InstitutionService),
):
    return institution_service.get_institutions(paginator)


@router.get(
    "/{institution_id}", 
    description='Returns details for an institution given its id',
    response_model=InstitutionRead,
)
async def get_institution_by_id(
        institution_id: int = Path(default=..., gt=0),
        institution_service: InstitutionService = Depends(InstitutionService),
):
    return institution_service.get_institution_by_id(institution_id)


@router.patch(
    "/{institution_id}", 
    description='Updates the details of an institution given its id and updated information',
    response_model=int,
    dependencies=[Depends(is_researcher)] 
)
async def update_institution(
        institution: InstitutionUpdate,
        institution_id: int = Path(default=..., gt=0),
        institution_service: InstitutionService = Depends(InstitutionService),
):
    return institution_service.update_institution(institution, institution_id)


@router.post(
    "/", 
    description='Creates an institution given the appropriate information',
    response_model=int,
    dependencies=[Depends(is_researcher)]
)
async def create_institution(
        institution: InstitutionCreate,
        institution_service: InstitutionService = Depends(InstitutionService),
):
    return institution_service.create_institution(institution)


@router.delete(
    "/{institution_id}", 
    description='Deletes an institution given its id',
    dependencies=[Depends(is_researcher)]
)
async def delete_institution(
        institution_id: int = Path(default=..., gt=0),
        institution_service: InstitutionService = Depends(InstitutionService),
):
    return institution_service.delete_institution(institution_id)
    

@router.get(
    "/{institution_id}/researchers",
    description='Returns all researchers associated with an institution given the institution id',
    response_model=Page[Researcher]
)
async def get_institution_researchers(
        paginator: Paginator = Depends(get_paginator),
        institution_id: int = Path(default=..., gt=0),
        institution_service: InstitutionService = Depends(InstitutionService)
):
    return institution_service.get_institution_researchers(paginator, institution_id)


@router.get(
    "/{institution_id}/research_stories",
    description='Returns all research stories associated with an institution given the institution id',
    response_model=Page[ResearchStoryShortRead]
)
async def get_institution_stories(
        paginator: Paginator = Depends(get_paginator),
        institution_id: int = Path(default=..., gt=0),
        institution_service: InstitutionService = Depends(InstitutionService)
):
    return institution_service.get_institution_stories(paginator, institution_id)
