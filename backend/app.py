from datetime import timedelta

from flask import Flask, jsonify, request

from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager, create_refresh_token

import pymongo
from bson.objectid import ObjectId

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
lawyer_posts = db["lawyer_posts"]

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

@app.route("/lawyers/create", methods=["POST"])
@jwt_required
def create_lawyer():
    username = request.json.get("username", None)
    type_of_service = request.json.get("type", None)
    description = request.json.get("description", None)

    _id = lawyer_posts.insert_one(
        {"username": username, "service": type_of_service, "description": description}).inserted_id

    return jsonify({"message": "Success", "id": _id}), 200

@app.route("/lawyers/delete", methods=["DELETE"])
@jwt_required
def delete_lawyer():
    username = request.json.get("username", None)
    _id = request.json.get("id", None)

    find = lawyer_posts.find({"_id" : ObjectId(_id)})

    exists = True if find else False

    if not exists:
        return jsonify({"message": "That post does not exist"}), 404

    same_user = True if find["username"] == username else False

    if not same_user:
        return jsonify({"message": "You do not own this post"}), 403
    
    lawyer_posts.delete_one({"_id" : ObjectId(_id)})

    return jsonify({"message": "Success"}), 200





if __name__ == "__main__":
    app.run(debug=True)
