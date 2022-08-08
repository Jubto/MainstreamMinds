from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.models.user import Role


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    sub: Optional[str]
    exp: Optional[datetime]
    role: Optional[Role]
