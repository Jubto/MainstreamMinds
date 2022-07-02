from sqlmodel import Session

from app.db import get_session, engine, create_db_and_tables
from app.models.user import User
from app.repositories.base import BaseRepository
from app.repositories.user import UserRepository

from sqlmodel.sql.expression import Select, SelectOfScalar

SelectOfScalar.inherit_cache = True  # type: ignore
Select.inherit_cache = True  # type: ignore


def test_user_repository():
    # Test that can instantiate UserRepository and that it can handle using generic
    # to make correct sql calls
    with Session(engine) as session:
        create_db_and_tables()
        repository = UserRepository(session=session)
    print(repository.get_all())

    assert repository is not None
