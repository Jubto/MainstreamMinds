from app.models.researcher import ResearcherRead
from app.models.institution import InstitutionRead
from app.models.research_story import ResearchStoryShortRead, ResearchStoryLongRead
from app.models.tag import TagRead
from app.models.user import UserRead
from app.models.comment import CommentRead

# https://github.com/tiangolo/sqlmodel/issues/121
# another problem with fastapi/sqlmodel... very cool
ResearchStoryShortRead.update_forward_refs(ResearcherRead=ResearcherRead, InstitutionRead=InstitutionRead, TagRead=TagRead)
ResearchStoryLongRead.update_forward_refs(ResearcherRead=ResearcherRead, InstitutionRead=InstitutionRead, TagRead=TagRead)
CommentRead.update_forward_refs(UserRead=UserRead)
