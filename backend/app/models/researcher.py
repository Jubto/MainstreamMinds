from typing import Optional, List
from datetime import datetime

from sqlmodel import SQLModel, Field, Relationship
from app.models.institution import Institution, InstitutionResearcherLink


class StoryAuthorLink(SQLModel, table=True):
    story_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="researchstory.id")
    researcher_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="researcher.id")


class ResearcherBase(SQLModel):
    bio: Optional[str] = Field()
    institution_id: Optional[int] = Field(foreign_key="institution.id")


class Researcher(ResearcherBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date_verified: datetime = Field(default_factory=datetime.now, nullable=False)
    user_id: int = Field(index=True, nullable=False, foreign_key="user.id", sa_column_kwargs={'unique': True})
    user: Optional["User"] = Relationship()

    institution: Optional["Institution"] = Relationship(back_populates="researchers",
                                                        link_model=InstitutionResearcherLink)
    stories: List["ResearchStory"] = Relationship(back_populates="researchers", link_model=StoryAuthorLink)


class ResearcherCreate(ResearcherBase):
    pass


class ResearcherCreated(SQLModel):
    researcher_id: int
    access_token: str
    token_type: str


class ResearcherUpdate(ResearcherBase):
    pass


class ResearcherRead(ResearcherBase):
    id: int
    user_id: int
    user: Optional["UserRead"]
