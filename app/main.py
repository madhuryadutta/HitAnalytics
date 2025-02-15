from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from databases import Database
from sqlalchemy import create_engine, Column, Integer, String, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel, Field
from datetime import date
import os

DATABASE_URL = os.environ.get("DB_URL")


app = FastAPI()

# Configure CORS middleware to allow requests from your frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend URL or "*" to allow all origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Database setup
database = Database(DATABASE_URL)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class UserVisit(Base):
    __tablename__ = "user_visits"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    visit_date = Column(Date)
    ip_address = Column(String)  # Column to store IP address
    ip_country = Column(String)
    public_key = Column(String)  # Column to store secret_code


# Async function to create database tables
async def create_tables():
    async with database.transaction():
        await database.execute(
            """
            CREATE TABLE IF NOT EXISTS user_visits (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                visit_date DATE NOT NULL,
                ip_address VARCHAR(255),
                ip_country VARCHAR(255),
                public_key VARCHAR(255)
            )
            """
        )


# Startup event to connect to the database and create tables if not exist
@app.on_event("startup")
async def startup():
    await database.connect()
    await create_tables()


# Shutdown event to disconnect from the database
@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


class Visit(BaseModel):
    user_id: str
    visit_date: date
    public_key: str = Field(..., alias="secret_code")  # Map secret_code to public_key


@app.get("/")
def read_root(request: Request):
    client_host = request.client.host
    return {"client_host": client_host}


@app.post("/track-visit")
async def track_visit(visit: Visit, request: Request):
    ip_address = request.client.host  # Default to the client's host IP
    ip_country = "Unknown"  # Placeholder, adjust as necessary or remove if unused

    # Extracting IP address and country from Cloudflare headers if present
    cf_ip_address = request.headers.get("CF-Connecting-IP")
    cf_ip_country = request.headers.get("CF-IPCountry")
    if cf_ip_address:
        ip_address = cf_ip_address
    if cf_ip_country:
        ip_country = cf_ip_country

    # Insert the visit into the database
    query = UserVisit.__table__.insert().values(
        user_id=visit.user_id,
        visit_date=visit.visit_date,
        public_key=visit.public_key,  # Use the mapped alias
        ip_address=ip_address,
        ip_country=ip_country,
    )

    try:
        last_record_id = await database.execute(query)
        print(
            f"Visitor IP: {ip_address} ({ip_country}) -- tracked id: {last_record_id}"
        )
        return {"message": "Visit tracked successfully", "id": last_record_id}
    except Exception as e:
        print("Exception occurred:", str(e))  # Print the exception message
        # Log the exception or handle it as needed
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": "An error occurred"},
        )
