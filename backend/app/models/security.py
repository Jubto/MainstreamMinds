from datetime import datetime
from typing import Union

from pydantic import BaseModel

from app.models.user import Role


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    sub: Union[str, None] = None
    exp: Union[datetime, None] = None
    role: Union[Role, None] = None
