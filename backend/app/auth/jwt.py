from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "supersecretkey123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow()+ timedelta(minutes= ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    token = jwt.encode(to_encode, SECRET_KEY, algorithm= ALGORITHM)

    return token

from jose import JWTError

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithm = [ALGORITHM])
        return payload
    except JWTError:
        return None
    