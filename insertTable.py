import boto3
from scrape import read

boto3.resource('dynamodb',aws_access_key_id=config.aws_access_key_id, aws_secret_access_key=config.aws_secret_access_key, region_name=config.region_name)

def insertJSON(tablename, json):
	table = dynamodb.Table(tablename)
	table.put_item(
	   Item=json
	)

json = read()
print(json)
insertJSON("sourceDistribution", json)
