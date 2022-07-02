from typing import Optional

from sqlmodel import SQLModel, Field


class UserBase(SQLModel):
    first_name: str = Field()
    last_name: str = Field()
    email: str = Field()


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


class UserRead(UserBase):
    id: int
