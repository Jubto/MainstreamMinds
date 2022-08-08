from app.models.comment import CommentRead
from app.models.institution import InstitutionRead
from app.models.research_story import ResearchStoryShortRead, ResearchStoryLongRead
from app.models.researcher import ResearcherRead
from app.models.tag import TagRead
from app.models.user import UserRead
# https://github.com/tiangolo/sqlmodel/issues/121
# another problem with fastapi/sqlmodel... very cool
from app.models.user import UserRead

ResearchStoryShortRead.update_forward_refs(ResearcherRead=ResearcherRead, InstitutionRead=InstitutionRead,
                                           TagRead=TagRead)
ResearchStoryLongRead.update_forward_refs(ResearcherRead=ResearcherRead, InstitutionRead=InstitutionRead,
                                          TagRead=TagRead)
ResearcherRead.update_forward_refs(UserRead=UserRead)
CommentRead.update_forward_refs(UserRead=UserRead)
UserRead.update_forward_refs(TagRead=TagRead)
