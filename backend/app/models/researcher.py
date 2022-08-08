from datetime import datetime
from typing import Optional, List

from pydantic import validator
from sqlmodel import SQLModel, Field, Relationship

from app.models.institution import Institution, InstitutionRead
from app.utils.model import email_validator


# ============================= Researcher LINK tables ================================

class StoryAuthorLink(SQLModel, table=True):
    story_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="researchstory.id")
    researcher_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="researcher.id")


# ============================= Researcher model / table ==============================

class ResearcherBase(SQLModel):
    bio: Optional[str] = Field()
    institution_id: Optional[int] = Field(foreign_key="institution.id")
    institution_email: Optional[str] = Field(default=None)
    institution_position: Optional[str] = Field(default=None)

    @validator('institution_email')
    def user_email_validator(cls, value):
        if value is None:
            return value
        return email_validator(value)


class Researcher(ResearcherBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date_verified: datetime = Field(default_factory=datetime.now, nullable=False)
    user_id: int = Field(index=True, nullable=False, foreign_key="user.id", sa_column_kwargs={'unique': True})
    user: Optional["User"] = Relationship()

    institution: Optional["Institution"] = Relationship(back_populates="researchers")
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
    institution: Optional["InstitutionRead"]
