from sqlmodel import create_engine, SQLModel, Session

from app.settings import get_settings

engine = create_engine(get_settings().DB_CONN, echo=True, connect_args={"check_same_thread": False})


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
