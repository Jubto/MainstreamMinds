from fastapi import APIRouter, Depends, Path

from app.core.security import is_researcher
from app.models.institution import InstitutionRead, InstitutionCreate, InstitutionUpdate
from app.models.pagination import Page, Paginator, get_paginator
from app.models.research_story import ResearchStoryShortRead
from app.models.researcher import Researcher
from app.services.institution import InstitutionService

router = APIRouter(tags=['institution'])


@router.get(
    "/",
    response_model=Page[InstitutionRead],
)
async def get_institutions(
        paginator: Paginator = Depends(get_paginator),
        institution_service: InstitutionService = Depends(InstitutionService),
):
    """
    Return all institutions in the database
    """
    return institution_service.get_institutions(paginator)


@router.get(
    "/{institution_id}",
    response_model=InstitutionRead,
)
async def get_institution_by_id(
        institution_id: int = Path(default=..., gt=0),
        institution_service: InstitutionService = Depends(InstitutionService),
):
    """
    Return details for an institution given its id
    """
    return institution_service.get_institution_by_id(institution_id)


@router.patch(
    "/{institution_id}",
    response_model=int,
    dependencies=[Depends(is_researcher)]
)
async def update_institution(
        institution: InstitutionUpdate,
        institution_id: int = Path(default=..., gt=0),
        institution_service: InstitutionService = Depends(InstitutionService),
):
    """
    Update the details of an institution given its id and updated information
    """
    return institution_service.update_institution(institution, institution_id)


@router.post(
    "/",
    response_model=int,
    dependencies=[Depends(is_researcher)]
)
async def create_institution(
        institution: InstitutionCreate,
        institution_service: InstitutionService = Depends(InstitutionService),
):
    """
    Create an institution given the appropriate information
    """
    return institution_service.create_institution(institution)


@router.delete(
    "/{institution_id}",
    dependencies=[Depends(is_researcher)]
)
async def delete_institution(
        institution_id: int = Path(default=..., gt=0),
        institution_service: InstitutionService = Depends(InstitutionService),
):
    """
    Delete an institution given its id
    """
    return institution_service.delete_institution(institution_id)


@router.get(
    "/{institution_id}/researchers",
    response_model=Page[Researcher]
)
async def get_institution_researchers(
        paginator: Paginator = Depends(get_paginator),
        institution_id: int = Path(default=..., gt=0),
        institution_service: InstitutionService = Depends(InstitutionService)
):
    """
    Return all researchers associated with an institution given the institution id
    """
    return institution_service.get_institution_researchers(paginator, institution_id)


@router.get(
    "/{institution_id}/research_stories",
    response_model=Page[ResearchStoryShortRead]
)
async def get_institution_stories(
        paginator: Paginator = Depends(get_paginator),
        institution_id: int = Path(default=..., gt=0),
        institution_service: InstitutionService = Depends(InstitutionService)
):
    """
    Return all research stories associated with an institution given the institution id
    """
    return institution_service.get_institution_stories(paginator, institution_id)
