from pydantic import BaseModel, EmailStr, Field

class Register(BaseModel):
    name:     str
    age:      int   = Field(..., ge=1,  le=120)
    gender:   str
    email:    EmailStr
    password: str   = Field(..., min_length=6)

class Login(BaseModel):
    email:    EmailStr
    password: str

class BPData(BaseModel):
    sbp: int = Field(..., ge=50,  le=300, description="Systolic BP")
    dbp: int = Field(..., ge=30,  le=200, description="Diastolic BP")
    hr:  int = Field(..., ge=20,  le=250, description="Heart Rate")