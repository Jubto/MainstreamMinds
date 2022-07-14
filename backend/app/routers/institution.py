from typing import List

from fastapi import APIRouter, Depends

from app.core.security import get_request_user_id, is_consumer
from app.models.institution import InstitutionRead
from app.services.institution import InstitutionService

router = APIRouter(institutions=['institution'])


@router.get("/get_institutions", response_model=List[InstitutionRead], dependencies=[Depends(is_consumer)])
async def get_institutions(
        institution_service: InstitutionService = Depends(InstitutionService),
        current_user_id: int = Depends(get_request_user_id)
):
    return institution_service.get_institutions(current_user_id)


@router.patch("/add_institution", dependencies=[Depends(is_consumer)])
async def add_institution(
        # institution: str,
        # institution_service: InstitutionService = Depends(InstitutionService),
        # current_story_id: int = Depends(get_request_user_id),
):
    # return institution_service.add_institution(current_story_id, institution)
    return "hi"

@router.post("/create_institution", dependencies=[Depends(is_consumer)])
async def create_institution(
        # institution: InstitutionRead,
        # institution_service: InstitutionService = Depends(InstitutionService),
):
    # return institution_service.create_institution(institution)
    return "hi"
