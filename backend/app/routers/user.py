from typing import List

from fastapi import APIRouter, Depends

from app.models.user import UserRead
from app.services.user import UserService

router = APIRouter()


@router.get("", response_model=List[UserRead], name="users:get-all")
async def get_all_users(
        user_service: UserService = Depends(UserService)
):
    return user_service.get_all()


# /api/users/register
# /api/users/login
# /api/users/logout