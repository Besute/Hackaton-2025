from pydantic import BaseModel
from math import ceil


class AuthorizationHeader(BaseModel):
    authorization: str

class UserRegistration(BaseModel):
    login: str
    password: str

class Vertex(BaseModel):
    address: str
    client_type: str
    lt: float          | None = None
    lg: float          | None = None
    open_time: float   | None = None
    close_time: float  | None = None
    lunch_start: float | None = None
    lunch_end: float   | None = None

class VertexInput(BaseModel):
    address: str
    client_type: str
    lt: float          | None = None
    lg: float          | None = None
    working_hours: str
    lunch_hours: str   | None = None

class ArrayVertexInput(BaseModel):
    vertexes: list[VertexInput]

def vertex_from_input(vertex_input: VertexInput) -> Vertex:
    working_hours = vertex_input.working_hours.replace(' ', '').split('-')

    open_time=float(working_hours[0].split(':')[0]) + float(working_hours[0].split(':')[1]) / 60
    close_time=float(working_hours[1].split(':')[0]) + float(working_hours[1].split(':')[1]) / 60

    if vertex_input.lunch_hours is not None:
        lunch_hours = vertex_input.lunch_hours.replace(' ', '').split('-')

        lunch_start=float(lunch_hours[0].split(':')[0]) + float(lunch_hours[0].split(':')[1]) / 60
        lunch_end=float(lunch_hours[1].split(':')[0]) + float(lunch_hours[1].split(':')[1]) / 60

    else:
        lunch_start = None
        lunch_end = None

    return Vertex(
        address=vertex_input.address,
        client_type=vertex_input.client_type,
        lt=vertex_input.lt,
        lg=vertex_input.lg,
        open_time=open_time,
        close_time=close_time,
        lunch_start=lunch_start,
        lunch_end=lunch_end,
    )

def input_from_vertex(vertex_d: dict) -> VertexInput:
    vertex = Vertex(**vertex_d)
    return VertexInput(
        address=vertex.address,
        client_type=vertex.client_type,
        lt=vertex.lt,
        lg=vertex.lg,
        working_hours=f"{int(ceil(vertex.open_time))}:{str(ceil((vertex.open_time % 1) * 60)).zfill(2)} - {int(ceil(vertex.close_time))}:{str(ceil((vertex.close_time % 1) * 60)).zfill(2)}",
        lunch_hours=f"{int(ceil(vertex.lunch_start))}:{str(ceil((vertex.lunch_start % 1) * 60)).zfill(2)} - {int(ceil(vertex.lunch_end))}:{str(ceil((vertex.lunch_end % 1) * 60)).zfill(2)}" if vertex.lunch_start is not None and vertex.lunch_end is not None else None,
    )

class CurrentInfo(BaseModel):
    current_address: str | None = None
    current_lt: float    | None = None
    current_lg: float    | None = None
    current_hour: float  | None = None
