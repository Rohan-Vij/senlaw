from flask import Flask, jsonify, request

from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager

import pymongo

# create app & register login manager
app = Flask(__name__)
jwt = JWTManager(app)
# login to db
client = pymongo.MongoClient(
    "mongodb+srv://rohanvij:jD6t7pWkyUSDgQR@cluster0.s75ty.mongodb.net/senlaw?retryWrites=true&w=majority")
db = client["senlaw"]

# --- User Management ---
users = db["users"]

# Hard coding because this is a private repo
app.config["SECRET_KEY"] = "fcd6a76a409c0c785074f63d617b16b0a5a148534c1dbb33"


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
    return jsonify(access_token=access_token), 200

@app.route("/signup", methods=["POST"])
def signup():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    user = query_user(username)

    if user:
        return jsonify({"message": "User already exists"}), 400
    
    _id = users.insert_one({"username": username, "password": password}).inserted_id

    access_token = create_access_token(identity=str(_id))
    return jsonify(access_token=access_token), 200


# --- Routes ---

if __name__ == "__main__":
    app.run(debug=True)
