from typing import Optional

from sqlmodel import SQLModel, Field


class UserTagLink(SQLModel, table=True):
    user_id = Optional[int] = Field(default=None, primary_key=True, foreign_key="user.id")
    tag_id = Optional[int] = Field(default=None, primary_key=True, foreign_key="tag.id")
