from typing import List

from fastapi import APIRouter, Depends, Path, HTTPException

from app.core.security import get_request_user_id, is_consumer, is_researcher
from app.models.exception import HTTPExceptionResponse
from app.models.pagination import Page, Paginator, get_paginator
from app.models.tag import TagRead, TagCreate
from app.services.tag import TagService

router = APIRouter(tags=['tag'])


@router.get("/preference_tags", response_model=List[TagRead], dependencies=[Depends(is_consumer)])
async def get_preference_tags(
        tag_service: TagService = Depends(TagService),
        current_user_id: int = Depends(get_request_user_id)
):
    return tag_service.get_preference_tags(current_user_id)


@router.patch("/preference_tags", dependencies=[Depends(is_consumer)], responses={404: {"model": HTTPExceptionResponse}})
async def add_preference_tags(
        tag: str,
        tag_service: TagService = Depends(TagService),
        current_user_id: int = Depends(get_request_user_id),
):
    return tag_service.add_preference_tag(current_user_id, tag)


@router.post("/", response_model=TagRead, dependencies=[Depends(is_researcher)],
             responses={409: {"model": HTTPExceptionResponse}})
async def create_tag(
        tag: TagCreate,
        tag_service: TagService = Depends(TagService),
):
    return tag_service.create_tag(tag)


@router.get('/', response_model=Page[TagRead])
async def get_all_tags(
        paginator: Paginator = Depends(get_paginator),
        tag_service: TagService = Depends(TagService)):
    return tag_service.get_tags(paginator)


@router.get('/{tag_name}', response_model=TagRead, responses={404: {"model": HTTPExceptionResponse}})
async def get_tag_by_name(
        tag_name: str = Path(default=...),
        tag_service: TagService = Depends(TagService)
):
    tag = tag_service.get_tag_by_name(tag_name)
    if tag is None:
        raise HTTPException(status_code=404, detail="Tag not found")
    return tag
