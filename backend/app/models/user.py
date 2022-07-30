import enum
from typing import Optional, List

from pydantic import BaseModel
from sqlalchemy import Column, Enum
from sqlmodel import SQLModel, Field, Relationship

from app.models.tag import Tag, UserTagLink
from app.models.research_story import StoryLikeLink
from app.models.comment import UserCommentLikesLink


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

    story_likes: List["ResearchStory"] = Relationship(back_populates="likes", link_model=StoryLikeLink)
    preference_tags: List["Tag"] = Relationship(back_populates="user_preferences", link_model=UserTagLink)
    comment_likes: List["Comment"] = Relationship(back_populates="user_likes", link_model=UserCommentLikesLink)


class UserCreate(UserBase):
    password: str = Field()


class UserUpdate(SQLModel):
    first_name: Optional[str] = Field()
    last_name: Optional[str] = Field()
    email: Optional[str] = Field()
    password: Optional[str] = Field()


class UserRead(UserBase):
    id: int


class UserGetQuery(BaseModel):
    id: int
