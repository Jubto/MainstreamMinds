from http.client import HTTPException

from pydantic import BaseModel


class HTTPExceptionResponse(BaseModel):
    detail: str
