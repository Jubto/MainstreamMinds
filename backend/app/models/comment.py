import datetime

from typing import List, Optional
from sqlalchemy.orm import backref
from sqlmodel import SQLModel, Field, Relationship


class CommentBase(SQLModel):
    body: str = Field()
    parent_id: Optional[int] = Field(default=None, foreign_key="comment.id")
    story_id: int = Field(foreign_key="researchstory.id", index=True)  # indexed since we will join comments and stories often


class CommentCreate(CommentBase):
    pass


class CommentRead(CommentBase):
    id: int
    timestamp: datetime.datetime


class UserCommentLikesLink(SQLModel, table=True):
    comment_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="comment.id")
    user_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="user.id")


class Comment(CommentBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    user_id: int = Field(foreign_key="user.id")  # note: not optional, enforces total participation


    # no idea if this is correct, but in this way you *should* be able to get the parent or children of a comment
    # https://github.com/tiangolo/sqlmodel/issues/127
    children: List["Comment"] = Relationship(sa_relationship_kwargs=dict(
        backref=backref("parent", remote_side="Comment.id")
    ))

    user_likes: List["User"] = Relationship(back_populates="comment_likes", link_model=UserCommentLikesLink)


