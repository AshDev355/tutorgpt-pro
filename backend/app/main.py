from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
    name:str
    email:str
    password:str


@app.get("/")
def home():
    return {"message": "TutorGPT Backend Running"}

@app.post("/signup")
def signup(user:User):
    return {
        "message":f"Welcome {user.name}"
    }