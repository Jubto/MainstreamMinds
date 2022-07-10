import enum
from typing import Optional, List

from sqlalchemy import Column, Enum
from sqlmodel import SQLModel, Field, Relationship
from app.models.tag import UserTagLink
from app.models.research_story import StoryLikeLink


class Role(int, enum.Enum):
    ADMIN = 0
    RESEARCHER = 1
    CONSUMER = 2


class UserBase(SQLModel):
    first_name: str = Field()
    last_name: str = Field()
    email: str = Field(sa_column_kwargs={'unique': True})


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    password_hash: str = Field()
    role: Role = Field(sa_column=Column(Enum(Role)), default=Role.CONSUMER)

    story_like_links: List["ResearchStory"] = Relationship(back_populates="like_links", link_model=StoryLikeLink) 
    tag_links: List["Tag"] = Relationship(back_populates="user_links", link_model=UserTagLink)


class UserCreate(UserBase):
    password: str = Field()


class UserUpdate(SQLModel):
    first_name: Optional[str] = Field()
    last_name: Optional[str] = Field()
    email: Optional[str] = Field()
    password: Optional[str] = Field()

class TagTest(SQLModel):
    name: str = Field(index=True)

class UserRead(UserBase):
    id: int
    role: Role = Field(sa_column=Column(Enum(Role)))
