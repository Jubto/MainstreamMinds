import enum
from typing import List, Optional

from sqlalchemy import Column, Enum
from sqlmodel import Relationship, SQLModel, Field


class InstitutionResearcherLink(SQLModel, table=True):
    institution_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="institution.id")
    researcher_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="researcher.id")

class InstitutionStoryLink(SQLModel, table=True):
    institution_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="institution.id")
    story_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="researchstory.id")


class InstitutionBase(SQLModel):
    name: str = Field(index=True)
    location: str = Field()
    year_established: int = Field()
    logo: str = Field()


class Institution(InstitutionBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    # Institution contact - User object?

    researchers: List["Researcher"] = Relationship(back_populates="institution", link_model=InstitutionResearcherLink)
    stories: List["ResearchStory"] = Relationship(back_populates="institutions", link_model=InstitutionStoryLink)


class InstitutionRead(InstitutionBase):
    pass


class InstitutionUpdate(InstitutionBase):
    pass


class InstitutionCreate(InstitutionBase):
    pass


