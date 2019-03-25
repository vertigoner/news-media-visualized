from flask import Flask
from flask_restful import Api, Resource, reqparse
import boto3

import config
import db_util

db_util.createSourceDistributionTable()

# Flask framework
app = Flask(__name__)
api = Api(app)

class Table(Resource):
    def get(self, tablename):
        response = db_util.getJSON(tablename)
        return response["body"], response["status"]
      

api.add_resource(Table, "/<string:tablename>")

app.run(debug=True)