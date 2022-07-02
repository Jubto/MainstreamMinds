from sqlmodel import select

from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):

    def get_by_email(self, email: str) -> User:
        return self.session.exec(select(User).where(User.email == email)).first()
