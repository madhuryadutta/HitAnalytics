from sqlalchemy import Column, Integer, String, Date, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from databases import Database
import os

DATABASE_URL = os.environ.get("DB_URL")
database = Database(DATABASE_URL)


# from sqlalchemy import URL, create_engine

# connection_string = URL.create(
#     'postgresql',
#     username='koyeb-adm',
#     password='lvkRjdaZ9Oo4',
#     host='ep-broad-haze-72278793.ap-southeast-1.pg.koyeb.app',
#     database='koyebdb',
# )

# engine = create_engine(connection_string)


Base = declarative_base()


class UserVisit(Base):
    __tablename__ = "user_visits"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    visit_date = Column(Date)
