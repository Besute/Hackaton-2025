from pydantic import BaseModel


class AuthorizationHeader(BaseModel):
    authorization: str

class UserRegistration(BaseModel):
    login: str
    password: str
