from fastapi import APIRouter

from .comment import router as comment_router
from .institution import router as institution_router
from .populate import router as populate_router
from .research_story import router as story_router
from .researcher import router as researcher_router
from .tag import router as tag_router
from .user import router as user_router

api_router = APIRouter()
api_router.include_router(user_router, prefix='/users')
api_router.include_router(researcher_router, prefix='/researchers')
api_router.include_router(tag_router, prefix='/tags')
api_router.include_router(story_router, prefix='/research_stories')
api_router.include_router(institution_router, prefix='/institutions')
api_router.include_router(comment_router, prefix='/comments')
api_router.include_router(populate_router, prefix='/populate')
