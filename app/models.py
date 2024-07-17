from sqlalchemy import Column, Integer, String, Date, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from databases import Database
import os

DATABASE_URL = os.environ.get("DB_URL")
database = Database(DATABASE_URL)


Base = declarative_base()


class UserVisit(Base):
    __tablename__ = "user_visits"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    visit_date = Column(Date)
