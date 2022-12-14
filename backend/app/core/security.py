from datetime import datetime, timedelta
from typing import Union

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext

from app.models.security import TokenData
from app.models.user import User, Role
from app.repositories.user import UserRepository, get_user_repository
from app.settings import Settings, get_settings
from app.utils.exceptions import InvalidJWTHttpException, MissingPermissionsHttpException

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/users/login")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

settings: Settings = get_settings()


def authenticate_user(
        user_repository: UserRepository,
        email: str,
        password: str,
) -> Union[User, bool]:
    """
    Attempts to authenticate a user by given email and password
    returning the User object if it succeeds else returning False
    :param email:
    :param password:
    :param user_repository:
    :return:
    """
    user = user_repository.get_by_email(email)
    if not user or not verify_password(password, user.password_hash):
        return False
    return user


def create_token(data: TokenData):
    """
    Creates an encoded JWT token to return to the user
    :param data:
    :return:
    """
    data.exp = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(data.dict(), settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def get_request_user_id(token: str = Depends(oauth2_scheme)) -> int:
    """
    Attempts to validate and decode the current JWT access token for the HTTP
    request returning the user id if it is successful else raising InvalidCredentialsHttpException
    :param token:
    :raises InvalidCredentialsHttpException
    :return: Validated User
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise InvalidJWTHttpException()

    except JWTError:
        raise InvalidJWTHttpException()

    return user_id


def get_request_user(
        user_repository: UserRepository = Depends(get_user_repository),
        token: str = Depends(oauth2_scheme)
) -> User:
    """
    Attempts to validate and decode the current JWT access token for the HTTP
    request returning the user if it is successful else raising InvalidCredentialsHttpException
    :param user_repository:
    :param token:
    :raises InvalidCredentialsHttpException
    :return: Validated User
    """
    user_id = get_request_user(user_repository, token)
    user = user_repository.get(user_id)
    if user is None:
        raise InvalidJWTHttpException()
    return user


def is_admin(token: str = Depends(oauth2_scheme)):
    return does_request_user_have_permission(Role.ADMIN, token)


def is_researcher(token: str = Depends(oauth2_scheme)):
    return does_request_user_have_permission(Role.RESEARCHER, token)


def is_consumer(token: str = Depends(oauth2_scheme)):
    return does_request_user_have_permission(Role.CONSUMER, token)


def does_request_user_have_permission(
        min_role_required: Role,
        token: str = Depends(oauth2_scheme)
):
    """
    Attempts to validate and decode the current JWT access token for the HTTP
    request and checks if the user has the required role specified by min_role_required
    :param min_role_required: The minimum role required to access this route
    :param token:
    :raises InvalidCredentialsHttpException
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        role: Role = payload.get("role")
        if role is None or not can_role_access(min_role_required, role):
            raise MissingPermissionsHttpException()

    except JWTError:
        raise InvalidJWTHttpException()


def can_role_access(required_role: Role, role: Role):
    return role <= required_role


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)
