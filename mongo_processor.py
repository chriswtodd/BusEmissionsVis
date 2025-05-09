import os
from dotenv import load_dotenv
from pymongo import MongoClient
from flask import jsonify, request
from flask_restful import Resource
from pymongo.errors import BulkWriteError

#
# Development Environment 
#
load_dotenv()
mongo_local = MongoClient("mongodb://localhost:27017/test?retryWrites=true&w=majority")
# user = os.environ['MONGO_USER']
# password = os.environ['MONGO_PASS']
# mongo_online = MongoClient("mongodb+srv://{0}:{1}@cluster0-9mebh.mongodb.net/test?retryWrites=true&w=majority".format(user, password))

class Trips_Network(Resource):    
    def get_emissions_by_class_per_day(self, city, startDate, endDate, startTime, endTime):
        #### Deployment Environment
        db = mongo_local["test"]
        col = db["trips_2019"]

        #### Old dev env
        # db = mongo_client["emma"]["end_2019_pax_by_route"]
        # db = mongo_client["emma"]["trips"]
        result = col.aggregate([
            {"$match" : {
                "date" : { "$gte" : startDate }
            }},
            {"$match" : {
                "date" :{ "$lte" : endDate }
            }},
            {"$match" : {   
                "departure": { "$gt" : startTime }
            }},
            {"$match" : {   
                "departure": { "$lt" : endTime }
            }},
            {"$project" : { "_id" : 0 }},
            {"$group" : {
                "_id" : {
                    "date" : "$date",
                    "engine_type" : "$engine_type"
                },
                "trips" : { "$sum" : 1 },
                "avgSpeed" : { "$avg" : "$speed" },
                "avgDistance" : { "$avg" : "$distance" },
                "avgTime" : { "$avg" : { "$toInt" : "$time" }},
                "fc" : { "$sum" : "$FC" },
                "co" : { "$sum" : "$CO" },
                "hc" : { "$sum" : "$HC" },
                "pm" : { "$sum" : "$PM" },
                "nox" : { "$sum" : "$NOx" },
                "co2" : { "$sum" : "$CO2" },
                "carCo2Equiv" : { "$sum" : "$car_co2_equiv" },
                "paxKm" : { "$sum" : "$pax_km" },
            }},
            {"$addFields" : {
                "date" : {
                    "$dateFromString" : {
                        "dateString": "$_id.date",
                        "format" : "%Y/%m/%d"
                        }
                    },
                "engine_type" : "$_id.engine_type"
            }},
            {"$set" : {
                "avgTime" : {"$divide" : ["$avgTime", 60]}
            }},
            {"$project" : {
                "_id" : 0
            }},

       ]
       , allowDiskUse=True)

        return list(result)

    def get_emissions_by_class_per_hour(self, city, startDate, endDate, startTime, endTime):
        db = mongo_online["test"]["trips_2019"]

        #### Old dev env
        # db = mongo_client["emma"]["end_2019_pax_by_route"]
        # db = mongo_client["emma"]["trips"]
        col = db.aggregate([
            {"$match" : {
                    "date" :{ "$gte" : startTime },
            }},
            {"$match" : {
                    "date" :{ "$lte" : endTime },
            }},
            {"$match" : {   
                "departure": { "$gt" : startTime }
            }},
            {"$match" : {   
                "departure": { "$lt" : endTime }
            }},
            {"$set" : {
                "departure" : {
                    "$cond" : [ 
                        { "$eq" : [ "$departure", "24:00:00" ] },
                        "00:00:00",
                        "$departure"
                    ] 
                },
                "time" : { "$toInt" : "$time" }
            }},
            {"$project" : { "_id" : 0 }},
            {"$group" : {
                "_id" : {
                    "date" : "$date",
                    "hour" : {"$substr" : ["$departure", 0, 2]},
                    "engine_type" : "$engine_type"
                },
                "trips" : { "$sum" : 1 },
                "avgSpeed" : { "$avg" : "$speed" },
                "avgDistance" : { "$avg" : "$distance" },
                "avgTime" : { "$avg" : "$time" },
                "fc" : { "$sum" : "$FC" },
                "co" : { "$sum" : "$CO" },
                "hc" : { "$sum" : "$HC" },
                "pm" : { "$sum" : "$PM" },
                "nox" : { "$sum" : "$NOx" },
                "co2" : { "$sum" : "$CO2" },
                "carCo2Equiv" : { "$sum" : "$car_co2_equiv" },
                "paxKm" : { "$sum" : "$pax_km" },
            }},
            {"$addFields" : {
                "date" : {
                    "$dateFromString" : {
                        "dateString": {"$concat" : ["$_id.date", "T", "$_id.hour"]},
                        "format" : "%Y/%m/%dT%H"
                        }
                    },
                "engine_type" : "$_id.engine_type"
            }},
            {"$project" : {
                "_id" : 0
            }},
       ]
       , allowDiskUse=True)

        return list(col)