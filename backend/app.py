'''Main entrypoint file for the API.'''
import json
import os
from datetime import timedelta

import pymongo
from bson.objectid import ObjectId
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (JWTManager, create_access_token,
                                create_refresh_token, get_jwt_identity,
                                jwt_required)

# loading env variables
load_dotenv()

DB_PASSWORD = os.getenv('DB_PASSWORD')
SECRET_KEY = os.getenv('SECRET_KEY')

# create app & register login manager
app = Flask(__name__)
CORS(app)

app.config["SECRET_KEY"] = SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)

jwt = JWTManager(app)

client = pymongo.MongoClient(
    f"mongodb+srv://rohanvij:{DB_PASSWORD}@cluster0.s75ty.mongodb.net"
    "/?retryWrites=true&w=majority")

db = client["senlaw"]
users = db["users"]
lawyer_posts = db["lawyer_posts"]
# load tags

with open('./tags.json', encoding='utf-8') as json_file:
    data = json.load(json_file)

tag_options = data["tags"]
# --- User Management ---


def query_user(username: str):
    """
    Query the database for a user with the given username.

    :param username: The username to search for.

    :return: The user if found, None otherwise.
    """
    user = users.find_one({"username": username})
    print(user)
    return None if not user else user


@app.route("/login", methods=["POST"])
def login():
    """
    Login a user.

    :return: A JWT access token if the user is found, an error otherwise.
    """
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    user = query_user(username)

    if not user:
        return jsonify({"message": "User not found"}), 404
    if password != user["password"]:
        return jsonify({"msg": "Incorrect or password"}), 401

    access_token = create_access_token(identity=str(user["_id"]))
    refresh_token = create_refresh_token(identity=str(user["_id"]))
    return jsonify(access_token=access_token, refresh_token=refresh_token), 200


@app.route("/signup", methods=["POST"])
def signup():
    """
    Signup a user.

    :return: A JWT access token if the user is created, an error otherwise.
    """
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
    """
    Refresh a JWT access token.

    :return: A JWT access token if the user is found and the token is valid, an error otherwise.
    """
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token)


@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    """
    Logout a user. (not used)

    :return: A message indicating the user has logged out.
    """
    # Maybe revoke a refresh token? I don't know if this could negatively affect older users
    # Maybe it's worth a try if we have more time
    return jsonify({"message": "Logged out"}), 200

# --- Routes ---


@app.route("/lawyers/create", methods=["POST"])
@jwt_required()
def create_lawyer():
    """
    Create a post of a lawyer/law firm's information.

    :return: A message indicating the post was created and its id.
    """
    username = request.json.get("username", None)
    title = request.json.get("title", None)
    tags = request.json.get("tags", None)
    for tag in tags:
        if tag not in tag_options:
            return jsonify({"message": "Invalid tag"}), 400

    description = request.json.get("description", None)
    contact = request.json.get("contact", None)

    _id = lawyer_posts.insert_one(
        {
            "username": username,
            "title": title,
            "tags": tags,
            "description": description,
            "contact": contact
        }).inserted_id

    return jsonify({"message": "Success", "id": str(_id)}), 200


@app.route("/lawyers/delete", methods=["DELETE"])
@jwt_required()
def delete_lawyer():
    """
    Delete a post of a lawyer/law firm's information.

    :return: A message indicating the post was deleted.
    """
    username = request.json.get("username", None)
    _id = request.json.get("id", None)

    find = lawyer_posts.find({"_id": ObjectId(_id)})

    exists = bool(find)

    if not exists:
        return jsonify({"message": "That post does not exist"}), 404

    same_user = find["username"] == username

    if not same_user:
        return jsonify({"message": "You do not own this post"}), 403

    lawyer_posts.delete_one({"_id": ObjectId(_id)})

    return jsonify({"message": "Success"}), 200


@app.route("/lawyers/update", methods=["PUT"])
@jwt_required()
def update_lawyer():
    """
    Update a post of a lawyer/law firm's information.

    :return: A message indicating the post was updated.
    """
    username = request.json.get("username", None)
    _id = request.json.get("id", None)

    title = request.json.get("title", None)
    tags = request.json.get("tags", None)

    for tag in tags:
        if tag not in tag_options:
            return jsonify({"message": "Invalid tag"}), 400

    description = request.json.get("description", None)

    contact = request.json.get("contact", None)

    find = lawyer_posts.find({"_id": ObjectId(_id)})

    exists = bool(find)

    if not exists:
        return jsonify({"message": "That post does not exist"}), 404

    same_user = find["username"] == username

    if not same_user:
        return jsonify({"message": "You do not own this post"}), 403

    lawyer_posts.find_one_and_update({"_id": _id},
                                     {"$set": {
                                         "username": username,
                                         "title": title,
                                         "tags": tags,
                                         "description": description,
                                         "contact": contact}
                                      })

    return jsonify({"message": "Success"}), 200


@app.route("/lawyers/viewmine", methods=["GET"])
@jwt_required()
def viewmine_lawyer():
    """
    View all posts of a user.

    :return: A list of posts.
    """
    username = request.json.get("username", None)

    posts_find = list(lawyer_posts.find({"username": username}))

    return jsonify({"message": "Success", "posts": posts_find}), 200


@app.route("/lawyers/all", methods=["GET"])
@jwt_required()
def view_all():
    """
    View all posts.

    :return: A list of posts.
    """
    posts_find = list(lawyer_posts.find())

    for post in posts_find:
        post["_id"] = str(post["_id"])

    return jsonify({"message": "Success", "posts": posts_find}), 200

@app.route("/lawyers/listtags", methods=["GET"])
def list_tags():
    """
    List all tags.

    :return: A list of tags.
    """
    return jsonify({"message": "Success", "tags": tag_options}), 200

@app.route("/lawyers/tags", methods=["GET"])
@jwt_required()
def get_by_tags():
    """
    View all posts with a certain tag.

    Example: /lawyers/tags?tag=Criminal_Law,Family_Law

    :return: A list of posts.
    """
    tag = request.args.getlist("tag")

    posts = []

    for option in tag:
        posts.append(lawyer_posts.find({"tags": option}))

    return jsonify({"message": "Success", "posts": posts}), 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
