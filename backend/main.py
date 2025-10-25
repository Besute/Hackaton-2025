import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import uvicorn

from typing import Annotated

from fastapi import FastAPI, Header, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer

from pydantic import BaseModel

from src import db
from src.models import UserRegistration, AuthorizationHeader


app = FastAPI()

origins = [
    "http://127.0.0.1:3000",
    "http://127.0.0.1"
    "http://localhost",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return "home"


# databas
@app.get("/create_database")
def create_database():
    db.create_database()
    return {"message": "Database created successfully"}

@app.get("/get_user_id")
def get_user_id(token: str):
    user_id = db.get_user_id(token)
    return {"user_id": user_id}


@app.post("/register")
def login_user(user: UserRegistration):
    token = db.add_user(user.login, user.password)
    return {"token": token}


@app.get("/get_vertexes")
def get_vertexes(authorization: Annotated[str, Header()] | None = None):
    if authorization is None:
        return {"error": "Authorization header is missing. Add 'authorization' to headers"}

    return {"auth": authorization}


if __name__ == "__main__":
    db.drop_database()
    db.create_database()

    uvicorn.run(app, host="127.0.0.1", port=8000)
