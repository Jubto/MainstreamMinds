from typing import List, Optional
from sqlmodel import Relationship, SQLModel, Field


class AuthorLink(SQLModel, table=True):
    research_story_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="researchstory.id")
    researcher_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="researcher.id")
    institution_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="institution.id")


class StoryLikeLink(SQLModel, table=True):
    research_story_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="researchstory.id")
    user_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="user.id")


class StoryTagLink(SQLModel, table=True):
    research_story_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="researchstory.id")
    tag_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="tag.id")


class ResearchStoryBase(SQLModel):
    story_title: str = Field()
    story_summary: str = Field()
    story_papers: List[str] = Field()
    meta_data: List[str] = Field()
    content_body: List[str] = Field()
    image_links: List[str] = Field()
    video_link: str = Field()
    transcript: str = Field()


class ResearchStory(ResearchStoryBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    researcher_links: List["Researcher"] = Relationship(back_populates="story_links", link_model=AuthorLink)
    institution_links: List["Institution"] = Relationship(back_populates="story_links", link_model=AuthorLink)
    like_links: List["User"] = Relationship(back_populates="story_like_links", link_model=StoryLikeLink)
    tag_links: List["Tag"] = Relationship(back_populates="story_links", link_model=StoryTagLink)


class ResearchStoryRead(ResearchStoryBase):
    pass


class ResearchStoryCreate(ResearchStoryBase):
    pass


class ResearchStoryUpdate(ResearchStoryBase):
    pass

    # tag_links: List["Tag"] = Relationship(back_populates="user_links", link_model=UserTagLink)
    # story_like_links: List["Tag"] = Relationship(back_populates="user_links", link_model=StoryLikeLink)
