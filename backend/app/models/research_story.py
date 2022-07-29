from datetime import datetime
from typing import List, Optional
from sqlmodel import Relationship, SQLModel, Field


# ============================= Research story LINK tables =============================

class StoryAuthorLink(SQLModel, table=True):
    story_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="researchstory.id")
    researcher_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="researcher.id")
    # institution_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="institution.id") TODO


class StoryLikeLink(SQLModel, table=True):
    story_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="researchstory.id")
    user_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="user.id")


class StoryTagLink(SQLModel, table=True):
    story_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="researchstory.id")
    tag_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="tag.id")


# ============================= research story models / table =============================

class ResearchStoryBase(SQLModel):
    title: str = Field()
    summary: str = Field()
    # papers: List[ResearchStoryPaper] = Field() Sqlite cannot handle Lists TODO
    papers: str = Field()  # temp
    thumbnail: str = Field()
    video_link: str = Field()
    transcript: Optional[str] = Field()


class ResearchStory(ResearchStoryBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    publish_date: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    content_body: str = Field()

    researchers: List["Researcher"] = Relationship(back_populates="stories", link_model=StoryAuthorLink)
    # institutions: List["Institution"] = Relationship(back_populates="stories", link_model=StoryAuthorLink)
    likes: List["User"] = Relationship(back_populates="story_likes", link_model=StoryLikeLink)
    tags: List["Tag"] = Relationship(back_populates="story_tags", link_model=StoryTagLink)


class ResearchStoryShortRead(ResearchStoryBase):
    id: int
    researchers: List["ResearcherRead"]
    tags: List["TagRW"]
    publish_date: datetime = Field()


class ResearchStoryCreate(ResearchStoryBase):
    authors: List[int] = Field()
    tags: List[int] = Field()
    content_body: str = Field()


class ResearchStoryLongRead(ResearchStoryShortRead):
    content_body: str = Field()


# i dont think the fields in update should be optional - consider youtube upload
# when you go to fill out the frontend form for update, the fields will be pre-filled with the current data
class ResearchStoryUpdate(ResearchStoryCreate):
    pass
