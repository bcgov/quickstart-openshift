import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .v1.routes.user_routes import router as user_router
from .core.config import Configuration

api_prefix_v1 = "/api/v1"
logging.getLogger("uvicorn").handlers.clear()  # removes duplicated logs

OpenAPIInfo = {
    "title": "FastAPI template for quickstart openshift",
    "version": "0.1.0",
    "description": "A boilerplate for FastAPI with SQLAlchemy, Postgres"
}
tags_metadata = [
    {
        "name": "FastAPI template for quickstart openshift",
        "description": "A quickstart template for FastAPI with SQLAlchemy, Postgres",
    },
]

app = FastAPI(title=OpenAPIInfo["title"],
              version=OpenAPIInfo["version"],
              openapi_tags=tags_metadata, )
origins: list[str] = [
    "http://localhost*",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Add filter to the logger


@app.get("/")
async def root():
    return {"message": "Route verification endpoints"}


app.include_router(user_router,
                   prefix=api_prefix_v1 + '/user',
                   tags=["User CRUD"])


# Define the filter
class EndpointFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        return record.args and len(record.args) >= 3 and record.args[2] != "/"


# Add filter to the logger
logging.getLogger("uvicorn.access").addFilter(EndpointFilter())
