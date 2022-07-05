import enum
from typing import List, Optional

from sqlalchemy import Column, Enum
from sqlmodel import SQLModel, Field, Relationship


class InstitutionBase(SQLModel):
    name: str = Field(index=True)


class Institution(InstitutionBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    # Institution contact - User object?

    researcher_links: List["Researcher"] = Relationship(back_populates="___", link_model="InstitutionResearcherLink")
    story_links: List["Story"] = Relationship(back_populates="___", link_model="InstitutionStoryLink")


class InstitutionRead(InstitutionBase):
    pass

class InstitutionResearcherLink(SQLModel, table=True):
    user_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="user.id")
    tag_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="tag.id")

class InstitutionStoryLink(SQLModel, table=True):
    pass
