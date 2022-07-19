from typing import List

from fastapi import APIRouter, Depends, Path
from fastapi.security import OAuth2PasswordRequestForm

from app.core.security import get_request_user, authenticate_user, create_token, is_admin, \
    is_researcher, is_consumer
from app.models.security import Token, TokenData
from app.models.user import UserRead, User, UserCreate
from app.repositories.user import UserRepository, get_user_repository
from app.services.user import UserService
from app.utils.exceptions import InvalidUserCredentials

router = APIRouter(tags=['user'])


@router.get("",
            description='Get a list of all user',
            response_model=List[UserRead],
            dependencies=[Depends(is_consumer)])
async def get_all_users(
        user_service: UserService = Depends(UserService),
):
    return user_service.get_all()


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
