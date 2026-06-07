from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://postgres:postgreASH355@localhost:5432/tutorgpt"

engine = create_engine(DATABASE_URL)

SessionalLocal = sessionmaker(
    autocommit= False,
    autoflush= False,
    bind= engine
)