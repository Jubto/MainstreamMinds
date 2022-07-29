from app.models.researcher import ResearcherRead
from app.models.research_story import ResearchStoryShortRead, ResearchStoryLongRead
from app.models.tag import TagRW

# https://github.com/tiangolo/sqlmodel/issues/121
# another problem with fastapi/sqlmodel... very cool
ResearchStoryShortRead.update_forward_refs(ResearcherRead=ResearcherRead, TagRW=TagRW)
ResearchStoryLongRead.update_forward_refs(ResearcherRead=ResearcherRead, TagRW=TagRW)
