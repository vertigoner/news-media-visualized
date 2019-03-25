import boto3

dynamodb = boto3.resource('dynamodb',aws_access_key_id='AKIAJZ6F6DJHN7MYYPJQ', aws_secret_access_key='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', region_name='us-east-2')

def insertJSON(tablename, json):
	table = dynamodb.Table(tablename)
	table.put_item(
	   Item={json}
	)