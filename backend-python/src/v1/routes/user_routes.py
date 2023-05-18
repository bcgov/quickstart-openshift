import logging
import os
from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.orm import Session
from src.db import session
from src.v1.structs.user import User
from src.v1.repository.user_repository import userRepository

router = APIRouter()


@router.get("/", response_model=List[User])
def read_users(
        db: Session = Depends(session.get_db),
        skip: int = 0,
        limit: int = 100
) -> Any:
    """
    Retrieve users.
    """
    logging.error(f"skip: {skip}, limit: {limit}")
    users = userRepository.get_multi(db, skip=skip, limit=limit)
    return users


@router.post("/", response_model=User)
def create_user(
        *,
        db: Session = Depends(session.get_db),
        user_in: User
) -> Any:
    """
    Create new user.
    """
    return userRepository.create(db, obj_in=user_in)
