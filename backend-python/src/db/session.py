from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from core.config import Configuration

engine = create_engine(Configuration.SQLALCHEMY_DATABASE_URI, pool_pre_ping=True, pool_size=5, max_overflow=5,
                       pool_recycle=120, pool_timeout=30, echo_pool=True, echo=True, pool_logging_name="py_api_pool")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
