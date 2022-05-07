from urllib.parse import urlparse, urljoin

from flask import Flask, Response, request, abort, redirect
from flask_login import LoginManager, login_user, login_required, UserMixin, current_user
import pymongo

# create app & register login manager
app = Flask(__name__)
login_manager = LoginManager()
login_manager.init_app(app)

# login to db
client = pymongo.MongoClient(
    "mongodb+srv://rohanvij:jD6t7pWkyUSDgQR@cluster0.s75ty.mongodb.net/senlaw?retryWrites=true&w=majority")
db = client["senlaw"]

# --- User Management ---
users = db["users"]

# Hard coding because this is a private repo
app.config["SECRET_KEY"] = "fcd6a76a409c0c785074f63d617b16b0a5a148534c1dbb33"


class User(UserMixin):
    is_active = True

    def __init__(self, id: str, username: str, password: str):
        self.id = id
        self.username = username
        self.password = password


@login_manager.user_loader
def query_user(username: str):
    user = users.find_one({"username": username})
    print(user)
    return None if not user else User(user["id"], username, user["password"])


# https://web.archive.org/web/20120517003641/http://flask.pocoo.org/snippets/62/
def is_safe_url(target):
    ref_url = urlparse(request.host_url)
    test_url = urlparse(urljoin(request.host_url, target))
    return test_url.scheme in ('http', 'https') and \
           ref_url.netloc == test_url.netloc

@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username")
    password = request.json.get("password")

    print(username)
    user = query_user(username)
    if not user:
        return Response({"error": "User not found"}, status=404, mimetype="application/json")
    elif password != user.password:
        return Response({"error", "Incorrect password"}, status=401, mimetype="application/json")

    login_user(user)

    next = request.args.get('next')
    # is_safe_url should check if the url is safe for redirects.
    # See http://flask.pocoo.org/snippets/62/ for an example.
    if not is_safe_url(next):
        return abort(400)

    return redirect(next or "/test")


# TODO: this is returning a 401 even when I log in -- why???
@app.route("/test")
@login_required
def test():
    return f"Hello, {current_user.username}"

"""
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
"""


# --- Routes ---

