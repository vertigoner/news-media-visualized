from flask import Flask
from flask_restful import Api, Resource, reqparse
import boto3

import config

# Get the service resource.
dynamodb = boto3.resource('dynamodb',aws_access_key_id=config.aws_access_key_id, aws_secret_access_key=config.aws_secret_access_key, region_name='us-east-2')

# Create the DynamoDB table.
try:
    table = dynamodb.create_table(
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
except dynamodb_client.exceptions.ResourceInUseException:
    pass

# Wait until the table exists.
table.meta.client.get_waiter('table_exists').wait(TableName='sourceDistribution')

# Print out some data about the table.
print(table.item_count)

# Flask framework
app = Flask(__name__)
api = Api(app)

keywords = [
    {
        "name": "Russia",
        "publications": {
            "The New York Times", 3,
            "CNN", 6,
            "Fox News", 1
        }
    },
    {
        "name": "wall",
        "publications": {
            "The New York Times", 3,
            "CNN", 2,
            "Fox News", 5
        }
    }
]

for k in keywords:
    json

class Keyword(Resource):
    def get(self, name):
        for k in keywords:
            if (name == k["name"]):
                return k, 200
        return "Keyword not found", 404 # TODO: search for and store results from new keyword if queried

# DynamoDB insertion
def insertJSON(tablename, json):
	table = dynamodb.Table(tablename)
	table.put_item(
	   Item=json
	)

# users = [
#     {
#         "name": "Nicholas",
#         "age": 42,
#         "occupation": "Network Engineer"
#     },
#     {
#         "name": "Elvin",
#         "age": 32,
#         "occupation": "Doctor"
#     },
#     {
#         "name": "Jass",
#         "age": 22,
#         "occupation": "Web Developer"
#     }
# ]

# class User(Resource):
#     def get(self, name):
#         for user in users:
#             if(name == user["name"]):
#                 return user, 200
#         return "User not found", 404

#     def post(self, name):
#         parser = reqparse.RequestParser()
#         parser.add_argument("age")
#         parser.add_argument("occupation")
#         args = parser.parse_args()

#         for user in users:
#             if(name == user["name"]):
#                 return "User with name {} already exists".format(name), 400

#         user = {
#             "name": name,
#             "age": args["age"],
#             "occupation": args["occupation"]
#         }
#         users.append(user)
#         return user, 201

#     def put(self, name):
#         parser = reqparse.RequestParser()
#         parser.add_argument("age")
#         parser.add_argument("occupation")
#         args = parser.parse_args()

#         for user in users:
#             if(name == user["name"]):
#                 user["age"] = args["age"]
#                 user["occupation"] = args["occupation"]
#                 return user, 200
        
#         user = {
#             "name": name,
#             "age": args["age"],
#             "occupation": args["occupation"]
#         }
#         users.append(user)
#         return user, 201

#     def delete(self, name):
#         global users
#         users = [user for user in users if user["name"] != name]
#         return "{} is deleted.".format(name), 200
      


api.add_resource(Keyword, "/keyword/<string:name>")

app.run(debug=True)