from typing import List

from fastapi import APIRouter, Depends

from app.core.security import get_request_user_id, is_consumer
from app.models.tag import TagRW
from app.services.tag import TagService

router = APIRouter(tags=['tag'])


@router.get("/preference_tags", response_model=List[TagRW], dependencies=[Depends(is_consumer)])
async def get_preference_tags(
        tag_service: TagService = Depends(TagService),
        current_user_id: int = Depends(get_request_user_id)
):
    return tag_service.get_preference_tags(current_user_id)


@router.patch("/preference_tags", dependencies=[Depends(is_consumer)])
async def add_preference_tags(
        tag: str,
        tag_service: TagService = Depends(TagService),
        current_user_id: int = Depends(get_request_user_id),
):
    return tag_service.add_preference_tag(current_user_id, tag)


# we want to exclude for admins only
@router.post("/tag", dependencies=[Depends(is_consumer)])
async def create_tag(
        tag: TagRW,
        tag_service: TagService = Depends(TagService),
):
    return tag_service.create_tag(tag)
