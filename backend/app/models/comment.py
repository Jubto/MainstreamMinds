import datetime

from typing import List, Optional
from sqlalchemy.orm import backref
from sqlmodel import SQLModel, Field, Relationship
from app.models.user import User


class CommentBase(SQLModel):
    body: str = Field()
    parent_id: Optional[int] = Field()


class CommentCreate(CommentBase):
    pass


class CommentRead(CommentBase):
    comment_id: int
    timestamp: datetime.datetime


# class Comment(CommentBase, table=True):
#     id: Optional[int] = Field(default=None, primary_key=True)  # primary key as int for fast joins with user/story
#     # https://github.com/tiangolo/sqlmodel/issues/21
#     # https://stackoverflow.com/questions/70949248/sqlmodel-datetime-field-is-throwing-error-upon-execution
#     timestamp: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
#     user_id: Field(foreign_key="user.id")  # note: not optional, enforces total participation
#     story_id: Field(foreign_key="story.id", index=True)  # indexed since we will join comments and stories often
#     parent_id: Optional[int] = Field(default=None, foreign_key="comment.id")
#
#     # no idea if this is correct, but in this way you *should* be able to get the parent or children of a comment
#     # https://github.com/tiangolo/sqlmodel/issues/127
#     children: List["Comment"] = Relationship(sa_relationship_kwargs=dict(
#         backref=backref("parent", remove_side="comment.id")
#     ))
#
#     user_like_links: List["User"] = Relationship(back_populates="comment_like_links", link_model="UserCommentLikesLink")

#
# class UserCommentLikesLink(SQLModel, table=True):
#     comment_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="comment.id")
#     user_id: Optional[int] = Field(default=None, primary_key=True, foreign_key="user.id")
