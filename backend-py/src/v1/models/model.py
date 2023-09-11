# coding: utf-8
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata


class FlywaySchemaHistory(Base):
    __tablename__ = 'flyway_schema_history'
    __table_args__ = {'schema': 'py_api'}

    installed_rank = Column(Integer, primary_key=True)
    version = Column(String(50))
    description = Column(String(200), nullable=False)
    type = Column(String(20), nullable=False)
    script = Column(String(1000), nullable=False)
    checksum = Column(Integer)
    installed_by = Column(String(100), nullable=False)
    installed_on = Column(DateTime, nullable=False, server_default=text("now()"))
    execution_time = Column(Integer, nullable=False)
    success = Column(Boolean, nullable=False, index=True)


class User(Base):
    __tablename__ = 'users'
    __table_args__ = {'schema': 'py_api'}

    id = Column(Integer, primary_key=True, server_default=text("nextval('py_api.users_id_seq'::regclass)"))
    name = Column(String(50), nullable=False)
    email = Column(String(50), nullable=False, unique=True)


class UserAddress(Base):
    __tablename__ = 'user_addresses'
    __table_args__ = {'schema': 'py_api'}

    id = Column(Integer, primary_key=True, server_default=text("nextval('py_api.user_addresses_id_seq'::regclass)"))
    street = Column(String(50), nullable=False)
    city = Column(String(50), nullable=False)
    state = Column(String(50), nullable=False)
    zip_code = Column(String(10), nullable=False)
    user_id = Column(ForeignKey('py_api.users.id', ondelete='CASCADE'), nullable=False)

    user = relationship('User')
