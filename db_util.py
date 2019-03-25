import boto3
import config

dynamodb = boto3.resource('dynamodb',aws_access_key_id=config.aws_access_key_id, aws_secret_access_key=config.aws_secret_access_key, region_name='us-east-2')
client = boto3.client('dynamodb', region_name='us-east-2')

def createSourceDistributionTable():
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
	except client.exceptions.ResourceInUseException:
		table = dynamodb.Table('sourceDistribution')
		pass

	# Wait until the table exists.
	table.meta.client.get_waiter('table_exists').wait(TableName='sourceDistribution')

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