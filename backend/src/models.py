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
    open_time: int | None = None
    close_time: int | None = None
    lunch_start: int | None = None
    lunch_end: int | None = None

class ArrayVertex(BaseModel):
    vertexes: list[Vertex]
