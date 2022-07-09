from typing import List

from fastapi import APIRouter, Depends

from app.core.security import get_request_user_id, is_consumer
from app.models.tag import TagRW
from app.services.tag import TagService

router = APIRouter(tags=['story'])

# API call for main page - return list of stories GET, filter on query param (likes, tags, noComments, insutition, author)
# API call for single story - return all details assoicated with story, GET/research-story/id path param

# GET /research_stories - 
    # param: Author, Institution, Tags, likes [asc, desc], comments [asc, desc], page_num, page_size
    # search (generic - title, summary, content, transcript),  
# GET /research_stories/{user_id} - returns stories based on recommender system for user_id
# GET /research_stories/trending - param: page_num, page_size, returns the globally trending stories
# GET /research_stories/{story_id}

# These could potentially be used to be more efficent, e.g. might have a use case on the frontend, and you don't want to send everything
# GET /research_stories/{story_id}/transcript (i.e. don't return this in the main GET /research_stories/{story_id})
# GET /research_stories/{story_id}/tags
# GET /research_stories/{story_id}/likes
# GET /research_stories/{story_id}/authors

# POST /research_stories - require body (not everything in required)
# PUT /research_stories/{story_id}
# DELETE /research_stories/{story_id}

@router.get("/get_preference_tags", response_model=List[TagRW], dependencies=[Depends(is_consumer)])
async def get_preference_tags(
        tag_service: TagService = Depends(TagService),
        current_user_id: int = Depends(get_request_user_id)
):
    return tag_service.get_preference_tags(current_user_id)

