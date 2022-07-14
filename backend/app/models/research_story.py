from datetime import datetime
from typing import List, Optional
from sqlmodel import Relationship, SQLModel, Field


# ============================= Research story LINK tables =============================

class StoryAuthorLink(SQLModel, table=True):
    story_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="researchstory.id")
    # researcher_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="researcher.id") TODO
    # institution_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="institution.id") TODO


class StoryLikeLink(SQLModel, table=True):
    story_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="researchstory.id")
    user_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="user.id")


class StoryTagLink(SQLModel, table=True):
    story_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="researchstory.id")
    tag_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="tag.id")


# ============================= field models =============================


class ResearchStoryAuthorInput(SQLModel):
    researcher_id: int = Field()
    institution_id: int = Field()


class ResearchStoryAuthorResponse(SQLModel):
    researcher_id: int = Field()
    researcher_name: str = Field()
    institution_id: int = Field()
    institution_name: str = Field()


class ResearchStoryPaper(SQLModel):
    paper_title: str = Field()
    paper_abstract: Optional[str] = Field()
    paper_link: str = Field()
    paper_citations: Optional[int] = Field()


class ResearchStoryLikes(SQLModel):
    user_id: int = Field()
    user_email: str = Field()


class ResearchStorytags(SQLModel):
    name: str = Field()


# ============================= research story models / table =============================


class ResearchStoryBase(SQLModel):
    title: str = Field()
    summary: str = Field()
    # papers: List[ResearchStoryPaper] = Field() Sqlite cannot handle Lists TODO
    papers: str = Field() # temp
    content_body: str = Field()
    thumbnail: str = Field()
    video_link: str = Field()
    transcript: str = Field()


class ResearchStory(ResearchStoryBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    publish_date: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    
    # researchers: List["Researcher"] = Relationship(back_populates="stories", link_model=StoryAuthorLink)
    # institutions: List["Institution"] = Relationship(back_populates="stories", link_model=StoryAuthorLink)
    likes: List["User"] = Relationship(back_populates="story_likes", link_model=StoryLikeLink)
    tags: List["Tag"] = Relationship(back_populates="story_tags", link_model=StoryTagLink)


# ============================= research story helper models =============================


class ResearchStoryShortRead(SQLModel):
    id: int
    title: str = Field()
    summary: str = Field()
    authors: List[ResearchStoryAuthorResponse]
    tags: List[ResearchStorytags]
    thumbnail: str = Field()
    video_link: str = Field()
    like_count: int = Field()
    publish_date: datetime = Field()


class ResearchStoryLongRead(ResearchStoryBase):
    id: int
    authors: List[ResearchStoryAuthorResponse] = Field()
    tags: List[ResearchStorytags] = Field()
    like_count: int = Field()
    like_list: List[ResearchStoryLikes] = Field()
    comment_count: int = Field()
    publish_date: datetime = Field()


class ResearchStoryCreate(SQLModel):
    title: str = Field()
    summary: str = Field()
    authors: List[ResearchStoryAuthorInput] = Field()
    papers: List[ResearchStoryPaper] = Field()
    tags: List[ResearchStorytags] = Field()
    content_body: str = Field()
    thumbnail: str = Field()
    video_link: str = Field()
    transcript: Optional[str] = Field()


class ResearchStoryUpdate(SQLModel):
    title: Optional[str] = Field()
    summary: Optional[str] = Field()
    authors: Optional[List[ResearchStoryAuthorInput]] = Field()
    papers: Optional[List[ResearchStoryPaper]] = Field()
    tags: Optional[List[ResearchStorytags]] = Field()
    content_body: Optional[str] = Field()
    thumbnail: Optional[str] = Field()
    video_link: Optional[str] = Field()
    transcript: Optional[str] = Field()


class ResearchStoryResponse(SQLModel):
    id: int = Field()
    title: Optional[str] = Field()
    summary: Optional[str] = Field()
    authors: Optional[List[ResearchStoryAuthorResponse]] = Field()
    # papers: Optional[List[ResearchStoryPaper]] = Field() TODO postgres
    papers: str = Field() # temp
    tags: Optional[List[ResearchStorytags]] = Field()
    content_body: Optional[str] = Field()
    thumbnail: Optional[str] = Field()
    video_link: Optional[str] = Field()
    transcript: Optional[str] = Field()
    publish_date: datetime = Field()
