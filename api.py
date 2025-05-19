from datetime import datetime, date
from flask import Flask, jsonify, request
from flask_restful import Api
from flask_cors import CORS
from mongo_processor import Trips_Network

from flask.json.provider import DefaultJSONProvider

class UpdatedJSONProvider(DefaultJSONProvider):
    def default(self, o):
        if isinstance(o, date) or isinstance(o, datetime):
            return o.isoformat()
        return super().default(o)

# DEV
app = Flask(__name__)
app.json = UpdatedJSONProvider(app)

# DEPLOYMENT ENV
# app = Flask(__name__, static_folder='./build', static_url_path='/')
api = Api(app)
CORS(app)

# DEPLOYMENT ENV
# @app.route('/')
# def index():
#     return app.send_static_file('index.html')
# @app.errorhandler(404)
# def not_found(e):
#     return app.send_static_file('index.html')

metlink_trips = Trips_Network()
route_col = []

@app.route('/routes', methods=["GET"])
def routes():
    # Get the routes from MongoAtlas,
    # set routes for successive requests
    return jsonify(metlink_trips.get_routes())

@app.route('/set_routes', methods=["POST"])
def set_routes():
    global route_col
    route_col = request.get_json()['routes']
    return jsonify(request.get_json())

@app.route('/day/<string:city>/<string:startDate>/<string:endDate>/<string:startTime>/<string:endTime>', methods=["GET"])
def trip(city, startDate, endDate, startTime, endTime):    
    # Clean date from url encoding
    startDate = startDate.replace("-", "/")
    endDate = endDate.replace("-", "/")

    # Clean time
    startTime = startTime + ":00"
    endTime = endTime + ":00"

    return jsonify(metlink_trips.get_emissions_by_class_per_day(city, startDate, endDate, startTime, endTime, route_col))

@app.route('/hour/<string:city>/<string:startDate>/<string:endDate>/<string:startTime>/<string:endTime>', methods=["GET"])
def tripHour(city, startDate, endDate, startTime, endTime):
    # Clean date from url encoding
    startDate = startDate.replace("-", "/")
    endDate = endDate.replace("-", "/")

    return jsonify(metlink_trips.get_emissions_by_class_per_hour(city, startDate, endDate, startTime, endTime))

@app.route('/login', methods=["POST"])
def login():
    return jsonify({"token": "TEST", "role": "TEST"})

if __name__ == "__main__":
    app.run()