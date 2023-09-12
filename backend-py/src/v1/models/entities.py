from sqlalchemy import Column, Integer, String, ForeignKey, Sequence, text
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()
metadata = Base.metadata


class User(Base):
    __tablename__ = 'users'
    __table_args__ = {'schema': 'py_api'}
    id = Column(Integer, server_default=text("nextval('py_api.users_id_seq'::regclass)"), primary_key=True)
    name = Column(String(50), nullable=False)
    email = Column(String(50), nullable=False, unique=True)

    # Relationship to UserAddress
    addresses = relationship("UserAddress", back_populates="user", lazy="dynamic", cascade="all, delete-orphan")


class UserAddress(Base):
    __tablename__ = 'user_addresses'
    __table_args__ = {'schema': 'py_api'}
    id = Column(Integer, server_default=text("nextval('py_api.user_addresses_id_seq'::regclass)"), primary_key=True)
    street = Column(String(50), nullable=False)
    city = Column(String(50), nullable=False)
    state = Column(String(50), nullable=False)
    zip_code = Column(String(10), nullable=False)
    user_id = Column(ForeignKey('py_api.users.id', ondelete='CASCADE'), nullable=False)
    user = relationship("User", back_populates="addresses")
