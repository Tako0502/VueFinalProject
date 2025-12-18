"""
database.py - SQLAlchemy Database Setup
Creates SQLite database connection and session management
"""
import os
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database URL (defaults to a local SQLite file)
#
# Notes for Vercel:
# - The filesystem is read-only except for `/tmp`
# - SQLite is not persistent between deployments/cold starts
#
# For real deployments, use a managed database and set `DATABASE_URL`.
DEFAULT_SQLITE_PATH = Path(__file__).resolve().parent / "lifeos.db"
if os.getenv("VERCEL"):
    DEFAULT_SQLITE_PATH = Path("/tmp/lifeos.db")

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_SQLITE_PATH}")

# Create SQLAlchemy engine
# check_same_thread=False is needed for SQLite to work with FastAPI
connect_args = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args=connect_args
)

# Create SessionLocal class for database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for database models
Base = declarative_base()


def get_db():
    """
    Dependency that provides a database session.
    Yields a session and closes it after the request is complete.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
