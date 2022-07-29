import enum
from typing import Optional
from datetime import datetime

from sqlmodel import SQLModel, Field, Relationship
from app.models.institution import Institution


class ResearcherBase(SQLModel):
    bio: Optional[str] = Field()
    institution_id: Optional[int] = Field(foreign_key="institution.id")


class Researcher(ResearcherBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date_verified: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    user_id: int = Field(index=True, nullable=False, foreign_key="user.id", sa_column_kwargs={'unique': True})

    institution: Optional[Institution] = Relationship(back_populates="researchers")


class ResearcherCreate(ResearcherBase):
    pass


class ResearcherUpdate(SQLModel):
    bio: Optional[str] = Field()
    institution_id: Optional[int] = Field(foreign_key="institution.id")


class ResearcherRead(ResearcherBase):
    pass