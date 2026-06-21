from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from sqlalchemy.orm import declarative_base
from sqlalchemy import ForeignKey

from sqlalchemy import DateTime
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String)
    email = Column(String)
    password = Column(String)


class PDF(Base):
    __tablename__ = "pdfs"

    id = Column(Integer, primary_key = True, index = True)

    filename = Column(String)
    filepath = Column(String)

    size = Column(String)
    pages = Column(Integer)

    subject = Column(String, default = "General")
    status = Column(String, default= "ready")

    uploaded_at = Column(DateTime, default = datetime.utcnow)

    owner_id = Column(Integer, ForeignKey("users.id"))

