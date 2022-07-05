from typing import List

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.core.security import get_request_user_id, is_consumer
from app.models.security import Token, TokenData
from app.models.tag import TagRead
from app.services.tag import TagService
from app.utils.exceptions import InvalidUserCredentials

router = APIRouter(tags=['tag'])


@router.get("/get_preference_tags", response_model=List[TagRead], dependencies=[Depends(is_consumer)])
async def get_preference_tags(
        tag_service: TagService = Depends(TagService),
        current_user_id: int = Depends(get_request_user_id)
):
    return tag_service.get_preference_tags(current_user_id)
