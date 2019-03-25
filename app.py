from flask import Flask
from flask_restful import Api, Resource, reqparse
import boto3

import config
import db_util

# Create the DynamoDB table.
try:
    table = db_util.dynamodb.create_table(
        TableName='sourceDistribution',
        KeySchema=[
            {
                'AttributeName': 'keyword',
                'KeyType': 'HASH'
            },
            {
                'AttributeName': 'publications',
                'KeyType': 'RANGE'
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'keyword',
                'AttributeType': 'S'
            },
            {
                'AttributeName': 'publications',
                'AttributeType': 'S'
            },
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
        }
    )
except db_util.client.exceptions.ResourceInUseException:
    table = db_util.dynamodb.Table('sourceDistribution')
    pass

# Wait until the table exists.
table.meta.client.get_waiter('table_exists').wait(TableName='sourceDistribution')

# Flask framework
app = Flask(__name__)
api = Api(app)

class Table(Resource):
    def get(self, tablename):
        response = db_util.getJSON(tablename)
        return response["body"], response["status"]
      

api.add_resource(Table, "/<string:tablename>")

app.run(debug=True)