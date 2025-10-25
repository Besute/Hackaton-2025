from pydantic import BaseModel


class AuthorizationHeader(BaseModel):
    authorization: str

class UserRegistration(BaseModel):
    login: str
    password: str

class Vertex(BaseModel):
    address: str
    client_type: str
    lt: float
    lg: float

class ArrayVertex(BaseModel):
    vertexes: list[Vertex]
