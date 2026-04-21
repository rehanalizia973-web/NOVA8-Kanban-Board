from pathlib import Path
from app.db.base import Base
from app.core.config import settings
from sqlalchemy import create_engine
from app.models import task as _task
from sqlalchemy.engine.url import make_url
from sqlalchemy.orm import Session, sessionmaker


def _ensure_sqlite_parent_dir(database_url: str) -> None:
    """Create the parent folder for file-backed SQLite URLs so first-boot doesn't fail."""
    url = make_url(database_url)
    if not url.drivername.startswith("sqlite"):
        return
    if not url.database or url.database == ":memory:":
        return
    Path(url.database).expanduser().parent.mkdir(parents=True, exist_ok=True)


_connect_args = (
    {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}
)
engine = create_engine(settings.database_url, connect_args=_connect_args, future=True)
SessionLocal = sessionmaker(
    bind=engine, autoflush=False, autocommit=False, class_=Session
)


def init_db() -> None:
    _ensure_sqlite_parent_dir(settings.database_url)
    Base.metadata.create_all(bind=engine)
