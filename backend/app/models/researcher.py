import enum
from typing import Optional
from datetime import datetime

from sqlalchemy import Column, Enum
from sqlmodel import SQLModel, Field

class Role(int, enum.Enum):
    ADMIN = 0
    RESEARCHER = 1
    CONSUMER = 2

class ResearcherBase(SQLModel):
    bio: str = Field()
    mobile: str = Field()
    email: str = Field(sa_column_kwargs={'unique': True})


class Researcher(ResearcherBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date_verified: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class ResearcherCreate(ResearcherBase):
    institution_id: int
    institution_name: int


class ResearcherUpdate(SQLModel):
    bio: Optional[str] = Field()
    mobile: Optional[str] = Field()
    email: Optional[str] = Field(sa_column_kwargs={'unique': True})


class ResearcherRead(ResearcherBase):
    user_id: int
    researcher_id: int
    first_name: str = Field()
    last_name: str = Field()
    user_email: str = Field(sa_column_kwargs={'unique': True})
    role: Role = Field(sa_column=Column(Enum(Role)))
    date_verified: datetime = Field()
