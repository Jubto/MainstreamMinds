from fastapi import HTTPException
from starlette import status


class InvalidCredentialsHttpException(HTTPException):
    def __init__(self):
        super(self).__init__(status_code=status.HTTP_401_UNAUTHORIZED,
                             detail="Could not validate credentials",
                             headers={"WWW-Authenticate": "Bearer"}, )
