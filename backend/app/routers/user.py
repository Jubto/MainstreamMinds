from typing import List

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.core.security import get_request_user, authenticate_user, Token, create_token, TokenData, is_admin, \
    is_researcher, is_consumer
from app.models.user import UserRead, User, UserCreate
from app.repositories.user import UserRepository, get_user_repository
from app.services.user import UserService
from app.utils.exceptions import InvalidUserCredentials

router = APIRouter(tags=['user'])


@router.get("", response_model=List[UserRead], name="users:get-all", dependencies=[Depends(is_consumer)])
async def get_all_users(
        user_service: UserService = Depends(UserService),
):
    return user_service.get_all()


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
