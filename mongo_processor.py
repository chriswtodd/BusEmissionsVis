import os
import re
from dotenv import load_dotenv
from pymongo import MongoClient
from flask import jsonify, request
from flask_restful import Resource
from pymongo.errors import BulkWriteError

# Deployment 
load_dotenv()
# user = os.environ['MONGO_USER']
# password = os.environ['MONGO_PASS']
# server = os.environ['MONGO_SERVER']
# mongo_online = MongoClient("mongodb+srv://{0}:{1}@{2}/test?retryWrites=true&w=majority".format(user, password, server))

# Development
mongo_local = MongoClient("mongodb://localhost:27017/test?retryWrites=true&w=majority")

class Trips_Network(Resource):
    '''
    Called to get the routes initially
    ''' 
    def get_routes(self):
        db = mongo_local["test"]["trips_2019"]
        col = db["trips_2019"]

        result = db.aggregate([
            {"$match" : {
                "_id" : {"$exists" : True}
            }},
            {"$group" : {
                "_id" : "$route"
            }},
            {"$addFields" : {
                "active" : True,
            }},
            {"$sort" : {
                "_id" : 1
            }}
        ]
        , allowDiskUse=True)

        route_list = list(result)
        route_dict = dict()

        for item in route_list:
            route_dict[item["_id"]] = True

        return_dict = dict()
        return_dict["routes"] = route_dict

        return  return_dict

    '''
    Called by api.py to return data for the Stream Graph &
    line chart visualisations
    '''
    def get_emissions_by_class_per_day(self, city, startDate, endDate, startTime, endTime, route_coll):
        #### Deployment Environment
        db = mongo_local["test"]
        col = db["trips_2019"]
        
        route_set = set()
        if isinstance(route_coll, dict):
            for entry in route_coll:
                if route_coll[entry]:
                    route_set.add(entry)
        
        route_list = list(route_set)
        if len(route_list) == 0:
            route_list.append("1")
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
            {"$match" : {
                "route" : {"$in" : route_list}
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
            {"$sort": { "date": -1, "engine_type": -1 }},

       ]
       , allowDiskUse=True)

        return list(result)

    # Called to load data at a more granular level, not suitable for deployment
    # as complex calculation, front end slows significantly
    def get_emissions_by_class_per_hour(self, city, startDate, endDate, startTime, endTime):
        # Development
        db = mongo_local["test"]["trips_2019"]
        
        # Deployment
        # db = mongo_online["test"]["trips_2019"]

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