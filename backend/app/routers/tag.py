from typing import List

from fastapi import APIRouter, Depends, Path, HTTPException
from pydantic import BaseModel

from app.core.security import get_request_user_id, is_consumer, is_researcher
from app.models.exception import Message404
from app.models.pagination import Page, Paginator, get_paginator
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


@router.post("/", dependencies=[Depends(is_researcher)])
async def create_tag(
        tag: TagRW,
        tag_service: TagService = Depends(TagService),
):
    return tag_service.create_tag(tag)


@router.get('/', response_model=Page[TagRW])
async def get_all_tags(
        paginator: Paginator = Depends(get_paginator),
        tag_service: TagService = Depends(TagService)):
    return tag_service.get_tags(paginator)


@router.get('/{tag_name}', response_model=TagRW, responses={404: {"model": Message404}})
async def get_tag_by_name(
        tag_name: str = Path(default=...),
        tag_service: TagService = Depends(TagService)
):
    tag = tag_service.get_tag_by_name(tag_name)
    if tag is None:
        raise HTTPException(status_code=404, detail="Tag not found")
    return tag
