from typing import List, Optional
from sqlmodel import Relationship, SQLModel, Field


# ============================= Research story LINK tables =============================

class AuthorLink(SQLModel, table=True):
    research_story_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="researchstory.id")
    # researcher_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="researcher.id")
    # institution_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="institution.id")


class StoryLikeLink(SQLModel, table=True):
    research_story_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="researchstory.id")
    user_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="user.id")


class StoryTagLink(SQLModel, table=True):
    research_story_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="researchstory.id")
    tag_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="tag.id")


# ============================= field models =============================


class ResearchStoryAuthor(SQLModel):
    researcher_id: int = Field()
    institution_id: int = Field()


class ResearchStoryPaper(SQLModel):
    paper_title: str = Field()
    paper_abstract: Optional[str] = Field()
    paper_link: str = Field()
    paper_citations: Optional[int] = Field()


class ResearchStoryLikes(SQLModel):
    user_id: int = Field()
    user_email: str = Field()


class ResearchStorytags(SQLModel):
    tag_id: int = Field()
    tag_name: str = Field()


# ============================= research story models / table =============================


class ResearchStoryBase(SQLModel):
    title: str = Field()
    summary: str = Field()
    authors: List[ResearchStoryAuthor] = Field()
    papers: List[ResearchStoryPaper] = Field()
    tags: List[ResearchStorytags] = Field()
    content_body: str = Field()
    thumbnail: str = Field()
    video_link: str = Field()
    transcript: str = Field()
    # publish_date: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class ResearchStory(ResearchStoryBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # researcher_links: List["Researcher"] = Relationship(back_populates="story_links", link_model=AuthorLink)
    # institution_links: List["Institution"] = Relationship(back_populates="story_links", link_model=AuthorLink)
    like_links: List["User"] = Relationship(back_populates="story_like_links", link_model=StoryLikeLink)
    tag_links: List["Tag"] = Relationship(back_populates="story_links", link_model=StoryTagLink)


# ============================= research story helper models =============================


class ResearchStoryShortRead(SQLModel):
    id: int
    authors: List[ResearchStoryAuthor]
    like_count: int = Field()
    tags: List[ResearchStorytags]
    story_title: str = Field()
    story_summary: str = Field()
    thumbnail: str = Field()
    video_link: str = Field()
    # publish_date: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class ResearchStoryLongRead(ResearchStoryBase):
    id: int
    like_count: int = Field()
    like_list: List[ResearchStoryLikes] = Field()
    comment_count: int = Field()


class ResearchStoryCreate(SQLModel):
    title: str = Field()
    summary: str = Field()
    authors: List[ResearchStoryAuthor] = Field()
    papers: List[ResearchStoryPaper] = Field()
    tags: List[ResearchStorytags] = Field()
    content_body: Optional[str] = Field()
    thumbnail: Optional[str] = Field()
    video_link: Optional[str] = Field()
    transcript: Optional[str] = Field()


class ResearchStoryUpdate(SQLModel):
    authors: Optional[List[ResearchStoryAuthor]] = Field()
    title: Optional[str] = Field()
    summary: Optional[str] = Field()
    papers: Optional[List[ResearchStoryPaper]] = Field()
    tags: Optional[List[ResearchStorytags]] = Field()
    content_body: Optional[str] = Field()
    thumbnail: Optional[str] = Field()
    video_link: Optional[str] = Field()
    transcript: Optional[str] = Field()
