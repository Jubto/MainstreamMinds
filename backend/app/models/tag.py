from typing import List, Optional

from sqlmodel import SQLModel, Field, Relationship

from app.models.research_story import StoryTagLink


class UserTagLink(SQLModel, table=True):
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", primary_key=True)
    tag_id: Optional[int] = Field(default=None, foreign_key="tag.id", primary_key=True)


class TagBase(SQLModel):
    # probably want index on this so we can have clean urls with fast query, ie site.com/fields/biology instead of
    # site.com/fields/25
    name: str = Field(index=True)


class Tag(TagBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)  # primary key as int for fast joins with user/story

    user_preferences: List["User"] = Relationship(back_populates="preference_tags", link_model=UserTagLink)
    story_tags: List["ResearchStory"] = Relationship(back_populates="tags", link_model=StoryTagLink)


class TagCreate(TagBase):
    pass


class TagRead(TagBase):
    id: Optional[int]
