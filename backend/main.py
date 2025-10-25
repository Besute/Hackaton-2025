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
from src.models import *


app = FastAPI()

origins = [
    "http://127.0.0.1:3000",
    "http://127.0.0.1",
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
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


# database
@app.get("/create_database")
def create_database():
    db.create_database()
    return {"message": "Database created successfully"}


@app.get("/get_user_id")
def get_user_id(token: str):
    user_id = db.get_user_id(token)
    return {"user_id": user_id}


# registration
@app.post("/register")
def register_user(user: UserRegistration):
    token = db.add_user(user.login, user.password)
    if token is None:
        return {"error": "User already exists"}
    return {"token": token}


@app.post("/login")
def login_user(user: UserRegistration):
    token = db.get_user_token(user.login, user.password)
    if token is None:
        return {"error": "Invalid credentials"}
    return {"token": token}


# vertexes
@app.get("/get_vertexes")
def get_vertexes(authorization: Annotated[str, Header()]):
    if authorization is None:
        return {"error": "Authorization header is missing. Add 'authorization' to headers"}

    vertexes = db.get_user_vertexes(authorization)
    if vertexes is None:
        return {"success": False, "error": "User not found"}
    return {"vertexes": vertexes}


@app.post("/add_vertexes")
def add_vertexes(vertex_input_array: ArrayVertexInput, authorization: Annotated[str, Header()]):
    user_id = db.get_user_id(authorization)
    if user_id is None:
        return {"success": False, "error": "User not found"}

    try:
        for vertex_input in vertex_input_array.vertexes:
            db.add_user_vertex(user_id, vertex_from_input(vertex_input))
    except Exception as e:
        return {"success": False, "error": str(e), "vertex": vertex_input}
    return {"success": True}


@app.post("/add_vertex")
def add_vertex(vertex_input: VertexInput, authorization: Annotated[str, Header()]):
    user_id = db.get_user_id(authorization)
    if user_id is None:
        return {"success": False, "error": "User not found"}

    try:
        db.add_user_vertex(user_id, vertex_from_input(vertex_input))
    except Exception as e:
        return {"success": False, "error": str(e)}
    return {"success": True}


@app.delete("/delete_vertex")
def delete_vertex(address: str, authorization: Annotated[str, Header()]):
    user_id = db.get_user_id(authorization)
    if user_id is None:
        return {"success": False, "error": "User not found"}

    db.delete_user_vertex(user_id, address)
    return {"success": True}


if __name__ == "__main__":
    db.drop_database()
    db.create_database()
    uvicorn.run(app, host="127.0.0.1", port=8000)
