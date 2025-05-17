from flask import Flask, jsonify
from flask_restful import Api
from flask_cors import CORS
from mongo_processor import Trips_Network

# DEV
app = Flask(__name__)

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

@app.route('/day/<string:city>/<string:startDate>/<string:endDate>/<string:startTime>/<string:endTime>', methods=["GET"])
def trip(city, startDate, endDate, startTime, endTime):    
    metlink_trips = Trips_Network()

    # Clean date from url encoding
    startDate = startDate.replace("-", "/")
    endDate = endDate.replace("-", "/")

    return jsonify(metlink_trips.get_emissions_by_class_per_day(city, startDate, endDate, startTime, endTime))

@app.route('/hour/<string:city>/<string:startDate>/<string:endDate>/<string:startTime>/<string:endTime>', methods=["GET"])
def tripHour(city, startDate, endDate, startTime, endTime):    
    metlink_trips = Trips_Network()
    # Clean date from url encoding
    startDate = startDate.replace("-", "/")
    endDate = endDate.replace("-", "/")

    return jsonify(metlink_trips.get_emissions_by_class_per_hour(city, startDate, endDate, startTime, endTime))


if __name__ == "__main__":
    app.run()