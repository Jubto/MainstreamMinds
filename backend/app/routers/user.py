from typing import List

from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.models.user import UserRead, User
from app.services.user import UserService

router = APIRouter()


@router.get("", response_model=List[UserRead], name="users:get-all")
async def get_all_users(
        user_service: UserService = Depends(UserService),
        user: User = Depends(get_current_user)
):
    return user_service.get_all()


# /api/users/register
# /api/users/login
# /api/users/logout