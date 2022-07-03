from typing import List, Optional

from sqlmodel import SQLModel, Field, Relationship


class TagBase(SQLModel):
    # probably want index on this so we can have clean urls with fast query, ie site.com/fields/biology instead of
    # site.com/fields/25
    name: str = Field(index=True)


class Tag(TagBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)  # primary key as int for fast joins with user/story

    user_links: List["User"] = Relationship(back_populates="tag_links", link_model="UserTagLink")


class TagRead(TagBase):
    pass  # user only provides tag name


class UserTagLink(SQLModel, table=True):
    user_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="user.id")
    tag_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="tag.id")


class StoryTagLink(SQLModel, table=True):
    story_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="story.id")
    tag_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="tag.id")

