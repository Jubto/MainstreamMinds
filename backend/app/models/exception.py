from pydantic import BaseModel


class HTTPExceptionResponse(BaseModel):
    detail: str
