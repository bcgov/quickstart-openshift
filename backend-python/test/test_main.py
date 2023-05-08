import logging
import os

from fastapi.middleware.cors import CORSMiddleware

from src.main import get_logging_level, EndpointFilter, get_app


def test_root():
    app = get_app()
    assert app is not None


def test_get_logging_level():
    os.environ["LOG_LEVEL"] = "40"
    assert get_logging_level() == 40


