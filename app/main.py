from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Initialize FastAPI
app = FastAPI()



# Configure CORS middleware to allow requests from your frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend URL or "*" to allow all origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


# Initialize database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define database models
class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(Integer, primary_key=True, index=True)
    activity = Column(String)
    geolocation = Column(String)
    ip = Column(String)
    country = Column(String)
    rum = Column(String)
    device = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic model for request body validation
class AnalyticsData(BaseModel):
    activity: str
    geolocation: str
    ip: str
    country: str
    rum: str
    device: str

# Routes
@app.post("/analytics/")
def create_analytics(analytics_data: AnalyticsData):
    db = SessionLocal()
    db_analytics = Analytics(**analytics_data.dict())
    db.add(db_analytics)
    db.commit()
    db.refresh(db_analytics)
    return db_analytics
@app.post("/api/track-event")
async def track_event(event_data: dict):
    # Placeholder for handling event data
    print(event_data)
    return {"status": "success", "received": event_data}
