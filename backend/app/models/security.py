from datetime import datetime
from typing import Union, Optional

from pydantic import BaseModel

from app.models.user import Role


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    sub: Optional[str] = None
    exp: Optional[datetime] = None
    role: Optional[Role] = None
