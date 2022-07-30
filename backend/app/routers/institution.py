from typing import List

from fastapi import APIRouter, Depends, Path

from app.core.security import get_request_user_id, is_consumer, is_researcher
from app.models.institution import InstitutionRead, InstitutionCreate, InstitutionUpdate
from app.services.institution import InstitutionService

router = APIRouter(tags=['institution'])


@router.get("/", response_model=List[InstitutionRead], dependencies=[Depends(is_consumer)])
async def get_institutions(
        institution_service: InstitutionService = Depends(InstitutionService),
):
    return institution_service.get_institutions()


@router.get("/{institution_id}", dependencies=[Depends(is_consumer)], response_model=InstitutionRead)
async def get_institution_by_id(
        institution_id: int = Path(default=..., gt=0),
        institution_service: InstitutionService = Depends(InstitutionService),
):
    return institution_service.get_institution_by_id(institution_id)
        

@router.patch("/{institution_id}", dependencies=[Depends(is_consumer)], response_model=int)
async def update_institution(
        institution: InstitutionUpdate,
        institution_id: int = Path(default=..., gt=0),
        institution_service: InstitutionService = Depends(InstitutionService),
):
    return institution_service.update_institution(institution, institution_id)


@router.post("/", dependencies=[Depends(is_consumer)], response_model=int)
async def create_institution(
        institution: InstitutionCreate,
        institution_service: InstitutionService = Depends(InstitutionService),
):
    return institution_service.create_institution(institution)


@router.delete("/{institution_id}", dependencies=[Depends(is_consumer)])
async def delete_institution(
        institution_id: int = Path(default=..., gt=0),
        institution_service: InstitutionService = Depends(InstitutionService),
):
    return institution_service.delete_institution(institution_id)
