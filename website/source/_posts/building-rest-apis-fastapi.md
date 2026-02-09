---
title: "Building REST APIs with FastAPI and Python"
date: 2026-02-07 14:00:00
tags: [FastAPI, Python, REST API, Backend]
categories: Web Development
description: "Master FastAPI to build high-performance REST APIs with automatic documentation and type validation."
keywords: "FastAPI, REST API, Python, backend, API development"
---

# Building REST APIs with FastAPI and Python

FastAPI has become the go-to framework for building high-performance APIs in Python. This guide covers everything from basics to advanced features.

## Why FastAPI?

FastAPI offers several advantages:

- **Performance**: On par with Node.js and Go
- **Type Safety**: Automatic Pydantic validation
- **Documentation**: Auto-generated OpenAPI docs
- **Developer Experience**: Easy to use and maintain

## Getting Started

```bash
pip install fastapi uvicorn pydantic
```

### Basic API Structure

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid

app = FastAPI(
    title="User Management API",
    description="A simple API for managing users",
    version="1.0.0"
)

# Data Models
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    age: Optional[int] = None

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    age: Optional[int]
    created_at: datetime

# In-memory database
users_db = {}

# Create User
@app.post("/users", response_model=UserResponse, status_code=201)
async def create_user(user: UserCreate):
    user_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    new_user = {
        "id": user_id,
        "name": user.name,
        "email": user.email,
        "age": user.age,
        "created_at": now
    }
    
    users_db[user_id] = new_user
    return new_user

# Get All Users
@app.get("/users", response_model=list[UserResponse])
async def get_users(skip: int = 0, limit: int = 10):
    users = list(users_db.values())
    return users[skip : skip + limit]

# Get Single User
@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return users_db[user_id]

# Update User
@app.put("/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, user_update: UserCreate):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users_db[user_id]
    user["name"] = user_update.name
    user["email"] = user_update.email
    user["age"] = user_update.age
    
    return user

# Delete User
@app.delete("/users/{user_id}", status_code=204)
async def delete_user(user_id: str):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    del users_db[user_id]
    return None

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Advanced Features

### Dependency Injection

```python
from fastapi import Depends, FastAPI
from typing import Annotated

class Database:
    def __init__(self):
        self.users = {}
    
    def get_user(self, user_id: str):
        return self.users.get(user_id)

db = Database()

async def get_db():
    return db

async def verify_user_exists(user_id: str, db: Annotated[Database, Depends(get_db)]):
    user = db.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/users/{user_id}")
async def read_user(user = Depends(verify_user_exists)):
    return user
```

### Authentication with OAuth2

```python
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import JWTError, jwt

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class Token(BaseModel):
    access_token: str
    token_type: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Validate credentials (simplified)
    if form_data.username != "admin" or form_data.password != "secret":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/protected")
async def protected_route(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return {"username": username, "message": "Access granted"}
```

### Background Tasks

```python
from fastapi import BackgroundTasks, FastAPI

def send_email(email: str, message: str):
    # Simulate email sending
    print(f"Sending email to {email}: {message}")

@app.post("/users/{user_id}/notify")
async def notify_user(user_id: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(send_email, f"user{user_id}@example.com", "Welcome!")
    return {"message": "Notification scheduled"}
```

### WebSockets

```python
from fastapi import FastAPI, WebSocket
from typing import Set

app = FastAPI()

connected_clients: Set[WebSocket] = set()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.add(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast to all clients
            for client in connected_clients:
                await client.send_text(f"Message: {data}")
    finally:
        connected_clients.remove(websocket)
```

## Database Integration with SQLAlchemy

```python
from fastapi import FastAPI, Depends
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

DATABASE_URL = "postgresql://user:password@localhost/dbname"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI()

@app.post("/users/")
def create_user(name: str, email: str, db: Session = Depends(get_db)):
    db_user = User(name=name, email=email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
```

## Testing FastAPI Applications

```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_user():
    response = client.post(
        "/users",
        json={"name": "John", "email": "john@example.com", "age": 30}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "John"
    assert "id" in data

def test_get_user():
    # Create user first
    client.post("/users", json={"name": "Jane", "email": "jane@example.com"})
    
    # Get user
    response = client.get("/users/1")
    assert response.status_code == 200
    assert response.json()["name"] == "Jane"
```

## Best Practices

1. **Use Pydantic Models**: Leverage type validation
2. **Implement Proper Error Handling**: Use HTTPException
3. **Add Rate Limiting**: Protect your API from abuse
4. **Use Environment Variables**: Store secrets securely
5. **Document Your API**: Use docstrings and OpenAPI
6. **Write Tests**: Ensure reliability and correctness
7. **Use Async/Await**: For I/O-bound operations

## Running in Production

```bash
# Using Gunicorn with Uvicorn workers
gunicorn main:app -k uvicorn.workers.UvicornWorker -w 4 -b 0.0.0.0:8000

# Using Docker
# Dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Conclusion

FastAPI provides a modern, high-performance framework for building APIs in Python. Its type safety, automatic documentation, and ease of use make it an excellent choice for projects of all sizes.
