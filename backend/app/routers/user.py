from typing import List, Any, Optional

from fastapi import APIRouter, Depends, Path, Query
from fastapi.security import OAuth2PasswordRequestForm

from app.core.security import get_request_user, authenticate_user, create_token, is_admin, \
    is_researcher, is_consumer, get_request_user_id
from app.models.pagination import Page, Paginator, get_paginator
from app.models.sorting import SortByFields, get_sort_by_fields
from app.models.filter import FilterExpression, FieldFilter, FilterOperation, FilterCompound, FilterCompoundOperation, \
    ModelFilter
from app.models.security import Token, TokenData
from app.models.user import UserRead, User, UserCreate, Role
from app.repositories.user import UserRepository, get_user_repository
from app.services.user import UserService
from app.utils.exceptions import InvalidUserCredentials

router = APIRouter(tags=['user'])


@router.get("",
            description='Get a list of all user',
            response_model=Page[UserRead],
            )
async def get_all_users(
        paginator: Paginator = Depends(get_paginator),
        sort_by: Optional[SortByFields[User]] = Depends(get_sort_by_fields(User, ['first_name', 'last_name'])),
        search: str = Query(description='String to filter results by', default=None),
        user_service: UserService = Depends(UserService),
):
    filter_by: Optional[ModelFilter[User]] = None
    if search:
        first_name_filter = FieldFilter(field='first_name', operation=FilterOperation.ILIKE, value=search, model=User)
        last_name_filter = FieldFilter(field='last_name', operation=FilterOperation.ILIKE, value=search, model=User)
        compound = FilterCompound(filters=[first_name_filter, last_name_filter], operator=FilterCompoundOperation.OR)
        filter_by = ModelFilter(FilterExpression(compound), User)
    return user_service.get_all(sort_by, filter_by, paginator)


@router.get("/{user_id}",
            description='Get a user by their id',
            dependencies=[Depends(is_consumer)],
            response_model=UserRead)
async def get_user_by_id(
        user_id: int = Path(default=..., gt=0),
        user_service: UserService = Depends(UserService),
):
    # return institution_service.add_institution(current_story_id, institution)
    return ""


@router.patch("/{user_id}", dependencies=[Depends(is_consumer)], response_model=UserRead)
async def update_user(
        user_id: int = Path(default=..., gt=0),
        user_service: UserService = Depends(UserService),
):
    # return institution_service.add_institution(current_story_id, institution)
    return ""


@router.delete("/{user_id}", dependencies=[Depends(is_consumer)])
async def delete_user(
        user_id: int = Path(default=..., gt=0),
        user_service: UserService = Depends(UserService),
):
    # return institution_service.add_institution(current_story_id, institution)
    return ""


@router.post("/login", response_model=Token)
async def login_with_password(
        form_data: OAuth2PasswordRequestForm = Depends(),
        user_repository: UserRepository = Depends(get_user_repository),
):
    user = authenticate_user(user_repository, form_data.username, form_data.password)
    if not user:
        raise InvalidUserCredentials()
    token = create_token(data=TokenData(sub=str(user.id), role=user.role))
    return {"access_token": token, "token_type": "bearer"}


@router.post("/register", response_model=Token)
async def register_user(
        created_user: UserCreate,
        user_service: UserService = Depends(UserService),
):
    user_service.create(created_user)
