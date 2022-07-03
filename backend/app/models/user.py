from typing import Optional

from sqlmodel import SQLModel, Field


class UserBase(SQLModel):
    first_name: str = Field()
    last_name: str = Field()
    email: str = Field()


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    password_hash: str = Field()


class UserCreate(UserBase):
    password: str = Field()


class UserUpdate(SQLModel):
    first_name: Optional[str] = Field()
    last_name: Optional[str] = Field()
    email: Optional[str] = Field()
    password: Optional[str] = Field()


class UserRead(UserBase):
    id: int
