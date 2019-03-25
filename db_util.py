import boto3
import config

dynamodb = boto3.resource('dynamodb',aws_access_key_id=config.aws_access_key_id, aws_secret_access_key=config.aws_secret_access_key, region_name='us-east-2')
client = boto3.client('dynamodb', region_name='us-east-2')

def insertJSON(tablename, json):
	table = dynamodb.Table(tablename)
	table.put_item(
	   Item=json
	)

def getJSON(tablename):
	table = dynamodb.Table(tablename)
	response = table.scan()
	return {
		"body": response["Items"],
		"status": response["ResponseMetadata"]["HTTPStatusCode"]
	}