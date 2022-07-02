from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.db import create_db_and_tables
from app.routers import api_router


def get_application() -> FastAPI:
    application = FastAPI()

    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.add_event_handler(
        "startup", create_db_and_tables
    )

    application.include_router(api_router, prefix='/api')

    return application


app = get_application()
