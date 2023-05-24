import os

from src.main import get_logging_level, app


def test_root():
    assert app is not None


def test_get_logging_level():
    os.environ["LOG_LEVEL"] = "40"
    assert get_logging_level() == 40


def test_get_logging_level_default():
    del os.environ["LOG_LEVEL"]
    assert get_logging_level() == 10
