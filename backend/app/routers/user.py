from typing import List

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from app.core.security import get_request_user, authenticate_user, Token, create_token, TokenData
from app.db import get_session
from app.models.user import UserRead, User
from app.repositories.user import UserRepository
from app.services.user import UserService
from app.utils.exceptions import InvalidUserCredentials

router = APIRouter()


@router.get("", response_model=List[UserRead], name="users:get-all")
async def get_all_users(
        user_service: UserService = Depends(UserService),
        user: User = Depends(get_request_user)
):
    return user_service.get_all()


@router.post("/login", response_model=Token)
async def login_for_access_token(
        form_data: OAuth2PasswordRequestForm = Depends(),
        user_repository: UserRepository = Depends(UserRepository),
):
    # user = authenticate_user(user_repository, form_data.username, form_data.password)
    user = None
    if not user:
        raise InvalidUserCredentials()
    return {"access_token": create_token(data=TokenData(user_id=user.id)), "token_type": "bearer"}

# /api/users/register
# /api/users/login
# /api/users/logout
