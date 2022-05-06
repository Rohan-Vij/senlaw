from fastapi import FastAPI, Response, status

from fastapi_login import LoginManager
from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_login.exceptions import InvalidCredentialsException

app = FastAPI()

# --- Database Connection ---

import pymongo

client = pymongo.MongoClient(
    "mongodb+srv://rohanvij:jD6t7pWkyUSDgQR@cluster0.s75ty.mongodb.net/senlaw?retryWrites=true&w=majority")
db = client["senlaw"]

users = db["users"]

# --- User Management ---

# Hard coding because this is a private repo
SECRET = "fcd6a76a409c0c785074f63d617b16b0a5a148534c1dbb33"

manager = LoginManager(SECRET, '/login')

@manager.user_loader()
def query_user(username: str):
    user = users.find_one({"username": username})
    return user

@app.post('/login', status_code=200)
def login(response: Response, data: OAuth2PasswordRequestForm = Depends()):
    username = data.username
    password = data.password

    user = query_user(username)
    if not user:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"error": "User does not exist"}
    elif password != user['password']:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"error": "Incorect password"}

    access_token = manager.create_access_token(
        data={'sub': username}
    )

    return {'access_token': access_token}

# @app.post('/signup')

# --- Routes ---


@app.get("/")
def root():
    return {"message": "Hello World"}
