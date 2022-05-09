from datetime import timedelta

from flask import Flask, jsonify, request

from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager, create_refresh_token

import pymongo

# create app & register login manager
app = Flask(__name__)

app.config["SECRET_KEY"] = "fcd6a76a409c0c785074f63d617b16b0a5a148534c1dbb33"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)

jwt = JWTManager(app)


# login to db
client = pymongo.MongoClient(
    "mongodb+srv://rohanvij:jD6t7pWkyUSDgQR@cluster0.s75ty.mongodb.net/senlaw?retryWrites=true&w=majority")
db = client["senlaw"]
users = db["users"]

# --- User Management ---


def query_user(username: str):
    user = users.find_one({"username": username})
    print(user)
    return None if not user else user


@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    user = query_user(username)

    if not user:
        return jsonify({"message": "User not found"}), 404
    elif username != "test" or password != "test":
        return jsonify({"msg": "Incorrect username or password"}), 401

    access_token = create_access_token(identity=str(user._id))
    refresh_token = create_refresh_token(identity=str(user._id))
    return jsonify(access_token=access_token, refresh_token=refresh_token), 200


@app.route("/signup", methods=["POST"])
def signup():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    user = query_user(username)

    if user:
        return jsonify({"message": "User already exists"}), 400

    _id = users.insert_one(
        {"username": username, "password": password}).inserted_id

    access_token = create_access_token(identity=str(_id))
    return jsonify(access_token=access_token), 200


@app.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token)


@app.route("/logout", methods=["POST"])
@jwt_required
def logout():
    # Maybe revoke a refresh token? I don't know if this could negatively affect older users
    # Maybe it's worth a try if we have more time
    return jsonify({"message": "Logged out"}), 200

# --- Routes ---


if __name__ == "__main__":
    app.run(debug=True)
