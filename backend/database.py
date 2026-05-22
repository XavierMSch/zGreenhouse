from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

URL = "sqlite:///./greenhouse.db"

engine = create_engine(URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
