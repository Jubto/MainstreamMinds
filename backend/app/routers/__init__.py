from fastapi import APIRouter
from .user import router as user_router
from .tag import router as tag_router
from .research_story import router as story_router
from .institution import router as institution_router

api_router = APIRouter()
api_router.include_router(user_router, prefix='/users')
api_router.include_router(tag_router, prefix='/tag')
api_router.include_router(story_router, prefix='/research_stories')
api_router.include_router(institution_router, prefix='/institutions')
