#!/bin/python3

from flask import Flask, request, jsonify
from flask_cors import CORS
from backend.database import init_db, db
from backend.models import User, Service

app = Flask(__name__)
CORS(app)
init_db(app)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    new_user = User(username=data['username'], email=data['email'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/services', methods=['GET'])
def get_services():
    services = Service.query.all()
    return jsonify([{'id': service.id, 'title': service.title, 'description': service.description, 'price': service.price} for service in services])

@app.route('/services', methods=['POST'])
def create_service():
    data = request.get_json()
    new_service = Service(title=data['title'], description=data['description'], price=data['price'], user_id=data['user_id'])
    db.session.add(new_service)
    db.session.commit()
    return jsonify({"message": "Service created successfully"}), 201

if __name__ == '__main__':
    app.run(debug=True)
