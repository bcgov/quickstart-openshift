from typing import Optional

from sqlalchemy.orm import Session
from ..structs.user import UserBase, User as UserUpdate
from ..models.entities import User
from ..repository.repository import BaseRepository


class UserRepository(BaseRepository[User, UserBase, UserUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def create(self, db: Session, *, obj_in: UserBase) -> User:
        db_obj = User(
            email=obj_in.email,
            name=obj_in.name,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


userRepository = UserRepository(User)
