from fastapi import HTTPException
from starlette import status


class InvalidUserCredentials(HTTPException):
    def __init__(self):
        super(InvalidUserCredentials, self).__init__(status_code=status.HTTP_401_UNAUTHORIZED,
                                                     detail="Incorrect username or password",
                                                     headers={"WWW-Authenticate": "Bearer"}, )


class InvalidJWTHttpException(HTTPException):
    def __init__(self):
        super(InvalidJWTHttpException, self).__init__(status_code=status.HTTP_401_UNAUTHORIZED,
                                                      detail="Could not validate token",
                                                      headers={"WWW-Authenticate": "Bearer"}, )


class MissingPermissionsHttpException(HTTPException):
    def __init__(self):
        super(MissingPermissionsHttpException, self).__init__(status_code=status.HTTP_403_FORBIDDEN,
                                                              detail="Missing permissions to perform this action", )


class EmailAlreadyExistsHttpException(HTTPException):
    def __init__(self):
        super(EmailAlreadyExistsHttpException, self).__init__(status_code=status.HTTP_409_CONFLICT,
                                               detail="Email already belongs to a registered user", )


class AuthorDetailsMissing(HTTPException):
    def __init__(self):
        super(AuthorDetailsMissing, self).__init__(status_code=status.HTTP_400_BAD_REQUEST,
                                                              detail="The research_id of the POST request is not present in the authors field", )
