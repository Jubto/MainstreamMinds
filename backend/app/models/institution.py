from typing import List, Optional

from sqlmodel import Relationship, SQLModel, Field


# ============================= Institution LINK tables =============================

class InstitutionStoryLink(SQLModel, table=True):
    institution_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="institution.id")
    story_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="researchstory.id")


# ============================= Institution models / table =============================

class InstitutionBase(SQLModel):
    name: str = Field(index=True)
    location: str = Field()
    year_established: int = Field()
    logo: str = Field()


class Institution(InstitutionBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    researchers: List["Researcher"] = Relationship(back_populates="institution")
    stories: List["ResearchStory"] = Relationship(back_populates="institutions", link_model=InstitutionStoryLink)


class InstitutionRead(InstitutionBase):
    pass


class InstitutionUpdate(InstitutionBase):
    pass


class InstitutionCreate(InstitutionBase):
    pass
