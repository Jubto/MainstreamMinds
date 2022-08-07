# import datetime, timezone
from datetime import datetime, timezone

from typing import List, Optional
from sqlalchemy.orm import backref
from sqlmodel import SQLModel, Field, Relationship


class CommentBase(SQLModel):
    body: str = Field()
    parent_id: Optional[int] = Field(default=None, foreign_key="comment.id")
    story_id: int = Field(foreign_key="researchstory.id", index=True)  # indexed since we join on this often


class CommentCreate(CommentBase):
    pass


class CommentRead(CommentBase):
    id: int
    user: Optional["UserRead"]
    timestamp: datetime
    num_likes: Optional[int] = 0


class UserCommentLikesLink(SQLModel, table=True):
    comment_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="comment.id")
    user_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="user.id")


class Comment(CommentBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime = Field(default_factory=datetime.now)
    user_id: int = Field(foreign_key="user.id")  # note: not optional, enforces total participation
    user: Optional["User"] = Relationship()

    # https://github.com/tiangolo/sqlmodel/issues/127
    children: List["Comment"] = Relationship(sa_relationship_kwargs=dict(
        backref=backref("parent", remote_side="Comment.id")  # this needs to be capitalised for some reason
    ))

    user_likes: List["User"] = Relationship(back_populates="comment_likes", link_model=UserCommentLikesLink)


