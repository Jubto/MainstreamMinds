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


class TagAlreadyExistsHttpException(HTTPException):
    def __init__(self):
        super(TagAlreadyExistsHttpException, self).__init__(status_code=status.HTTP_409_CONFLICT,
                                                            detail="Tag with given name already exists", )


class AlreadyResearcher(HTTPException):
    def __init__(self):
        super(AlreadyResearcher, self).__init__(status_code=status.HTTP_409_CONFLICT,
                                                detail="User already has the researcher role", )


class AuthorDetailsMissing(HTTPException):
    def __init__(self):
        super(AuthorDetailsMissing, self).__init__(status_code=status.HTTP_400_BAD_REQUEST,
                                                   detail="The researcher_id of the request is not present in the authors field", )


class NonExistentEntry(HTTPException):
    def __init__(self, field, item):
        super(NonExistentEntry, self).__init__(status_code=status.HTTP_404_NOT_FOUND,
                                               detail=f"No data entries found for: Field '{field}' data '{item}'", )
