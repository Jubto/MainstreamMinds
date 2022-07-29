import re

from sqlmodel import create_engine, SQLModel, Session

from app.settings import get_settings

db_conn = get_settings().DB_CONN
connect_args = {}
if re.search(r'sqlite', db_conn, flags=re.IGNORECASE):
    connect_args = {"check_same_thread": False}

engine = create_engine(db_conn, echo=True, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
