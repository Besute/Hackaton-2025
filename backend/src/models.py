from pydantic import BaseModel


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
    lunch_hours: str

class ArrayVertexInput(BaseModel):
    vertexes: list[VertexInput]

def vertex_from_input(vertex_input: VertexInput) -> Vertex:
    working_hours = vertex_input.working_hours.replace(' ', '').split('-')
    lunch_hours = vertex_input.lunch_hours.replace(' ', '').split('-')

    open_time=float(working_hours[0].split(':')[0]) + float(working_hours[0].split(':')[1]) / 60
    close_time=float(working_hours[1].split(':')[0]) + float(working_hours[1].split(':')[1]) / 60
    lunch_start=float(lunch_hours[0].split(':')[0]) + float(lunch_hours[0].split(':')[1]) / 60
    lunch_end=float(lunch_hours[1].split(':')[0]) + float(lunch_hours[1].split(':')[1]) / 60

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
