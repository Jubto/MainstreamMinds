from datetime import datetime, timedelta
from typing import Union

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext
from pydantic import BaseModel

from app.models.user import User
from app.repositories.user import UserRepository
from app.utils.exceptions import InvalidJWTHttpException

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/users/login")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# TODO: Get values from config
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Union[int, None] = None
    exp: Union[datetime, None] = None


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
    if not (user or verify_password(password, user.password_hash)):
        return False
    return user


def create_token(data: TokenData):
    """
    Creates an encoded JWT token to return to the user
    :param data:
    :return:
    """
    data.exp = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(data.dict(), SECRET_KEY, algorithm=ALGORITHM)


def get_request_user(
        user_repository: UserRepository = Depends(UserRepository),
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
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise InvalidJWTHttpException()
    except JWTError:
        raise InvalidJWTHttpException()
    user = user_repository.get(user_id)
    if user is None:
        raise InvalidJWTHttpException()
    return user
