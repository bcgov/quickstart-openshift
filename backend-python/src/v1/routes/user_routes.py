from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from psycopg2.errors import UniqueViolation
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from src.db import session
from src.v1.models import entities
from src.v1.repository.user_repository import userRepository
from src.v1.structs.user import UserBase, User

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
    # create User array from database objects by iterating over.
    users = userRepository.get_multi(db, skip=skip, limit=limit)
    return [User(user_id=user.id, email=user.email, name=user.name) for user in users]


@router.post("/", response_model=User)
def create_user(
        *,
        db: Session = Depends(session.get_db),
        user_in: UserBase
) -> Any:
    """
    Create new user.
    """
    db_obj = entities.User(
        email=user_in.email,
        name=user_in.name,
    )
    try:
        saved_object = userRepository.create(db, obj_in=db_obj)
        ret_usr = User(user_id=saved_object.id, email=saved_object.email, name=saved_object.name)
        return ret_usr
    except IntegrityError as ie:
        print(ie)
        if isinstance(ie.orig, UniqueViolation):
            raise HTTPException(status_code=409, detail="Email already registered.")
        else:
            db.rollback()
            raise ie
    except Exception as e:
        db.rollback()
        raise e


@router.get("/{user_id}", response_model=User)
def get_user(
        *,
        db: Session = Depends(session.get_db),
        user_id: int
) -> Any:
    """
    Get User By Id.
    """

    try:
        db_object = userRepository.get(db, key=user_id)
        if not db_object:
            raise HTTPException(
                status_code=404,
                detail="User Not Found.",
            )
        ret_usr = User(user_id=db_object.id, email=db_object.email, name=db_object.name)
        return ret_usr
    except Exception as e:
        db.rollback()
        raise e


@router.delete("/{user_id}", response_model=User)
def delete_user(
        *,
        db: Session = Depends(session.get_db),
        user_id: int
) -> Any:
    """
    Delete User By Id.
    """

    try:
        db_object = userRepository.get(db, key=user_id)
        if not db_object:
            raise HTTPException(
                status_code=404,
                detail="User Not Found.",
            )
        userRepository.remove(db, key=user_id)
        ret_usr = User(user_id=db_object.id, email=db_object.email, name=db_object.name)
        return ret_usr
    except Exception as e:
        db.rollback()
        raise e
