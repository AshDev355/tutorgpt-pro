from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from app.database.db import engine
from app.database.models import Base
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.db import SessionalLocal
from app.database.models import User

from app.schemas import UserCreate

# Passlib removed completely to bypass the Windows import bug
import bcrypt
from app.auth.jwt import create_access_token 


from fastapi import Header, HTTPException
from app.auth.jwt import verify_token

from fastapi import HTTPException, status
from fastapi.security import APIKeyHeader
import jose.jwt as jwt

# This tells FastAPI to look for an "authorization" header in Swagger
header_scheme = APIKeyHeader(name="authorization", auto_error=False)

SECRET_KEY = "supersecretkey123"
ALGORITHM = "HS256"

# --- MINIMAL BCRYPT UTILITIES (Replacing pwd_context) ---
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
# --------------------------------------------------------

def get_current_user(token: str = Depends(header_scheme)):
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization Header"
        )
    
    try:
        # If the token contains "Bearer ", strip it off cleanly
        if token.lower().startswith("bearer "):
            token = token.split(" ")[1]
            
        # Decode the real cryptographic payload data
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials / Invalid Token"
        )

Base.metadata.create_all(bind= engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserCreate(BaseModel):
    name:str
    email:str
    password:str

class UserLogin(BaseModel):
    email:str
    password:str

def get_db():
    db = SessionalLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {"message": "TutorGPT Backend Running"}

@app.post("/signup")
def signup(user:UserCreate, db: Session =Depends(get_db)):
    # Swapped pwd_context.hash for our clean bcrypt helper
    hashed_password = hash_password(user.password)
    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message":f"Welcome {new_user.name} created successfully",
        "user_id":new_user.id
    }

@app.post("/login")
def login(user:UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        return {"error": "Invalid credentials"}
    
    # Swapped pwd_context.verify for our clean bcrypt helper
    if not verify_password(user.password, db_user.password):
        return {"error": "Invalid credentials"}
    
    token = create_access_token(
        data = {"user_id": db_user.id, "email": db_user.email}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@app.get("/protected")
def protected_route(user=Depends(get_current_user)):
    return {
        "message": "You are authenticated!",
        "user": user
    }