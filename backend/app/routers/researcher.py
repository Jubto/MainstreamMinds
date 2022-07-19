from typing import Optional, List

from fastapi import APIRouter, Depends, Path, Query

from app.core.security import get_request_user_id, is_researcher
from app.models.researcher import (
    ResearcherRead,
    ResearcherUpdate,
    ResearcherCreate
)
from app.models.research_story import ResearchStoryShortRead

router = APIRouter(tags=['researcher'])

@router.get(
    "",
    description='Queries the database returning a list of researchers acording to any filters applied.',
    response_model=List[ResearcherRead]
)
async def get_researchers_by_filter(
    name: Optional[str] = Query(default=None, description="Only return list of researchers with this name"),
    tags: Optional[List[str]] = Query(default=None, description='Only return a list of researchers associated with this tag'),
):
    return None


@router.get(
    "/{story_id}",
    description='Returns details for the specified researcher',
    response_model=ResearcherRead
)
async def get_researcher_by_id(
    researcher_id: int = Path(default=..., gt=0),
):
    return None


@router.get(
    "/{story_id}/stories",
    description='Returns all stories assoicated with a researcher',
    response_model=List[ResearchStoryShortRead]
)
async def get_researcher_stories(
    researcher_id: int = Path(default=..., gt=0),
):
    return None


@router.post(
    "",
    description='This will permanently upgrade an existing user to hold researcher privliages',
    response_model=ResearcherRead,
    dependencies=[Depends(is_researcher)]
)
async def post_story(
    post_researcher: ResearcherCreate,
    jwt_derived_researcher_id: int = Depends(get_request_user_id),
):
    return None


@router.patch(
    "/{story_id}",
    description='Update details concerning researcher profile',
    response_model=ResearcherCreate,
    dependencies=[Depends(is_researcher)]
)
async def update_story_by_id(
    update_researcher: ResearcherUpdate,
    researcher_id: int = Path(default=..., gt=0),
    jwt_derived_researcher_id: int = Depends(get_request_user_id),
):
    return None


