from sqlalchemy import Column, Integer, String, ForeignKey, Sequence
from sqlalchemy.orm import relationship
from src.db.base_class import Base


class User(Base):
    id = Column(Integer, Sequence('user_id_seq'), primary_key=True)
    name = Column(String(50), nullable=False)
    email = Column(String(50), nullable=False, unique=True)

    # Relationship to UserAddress
    addresses = relationship("UserAddress", back_populates="user", lazy="dynamic", cascade="all, delete-orphan")


class UserAddress(Base):
    id = Column(Integer, Sequence('user_address_id_seq'), primary_key=True)
    street = Column(String(50), nullable=False)
    city = Column(String(50), nullable=False)
    state = Column(String(50), nullable=False)
    zip_code = Column(String(10), nullable=False)

    # Relationship to User
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    user = relationship("User", back_populates="addresses")
