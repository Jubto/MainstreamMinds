from fastapi import APIRouter
from .user import router as user_router
from .tag import router as tag_router

api_router = APIRouter()
api_router.include_router(user_router, prefix='/users')
api_router.include_router(tag_router, prefix='/tag')
