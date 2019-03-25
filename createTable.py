import boto3

# Get the service resource.
boto3.resource('dynamodb',aws_access_key_id=config.aws_access_key_id, aws_secret_access_key=config.aws_secret_access_key, region_name=config.region_name)

# Create the DynamoDB table.
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
            'AttributeType': 'M'
        },
    ],
    ProvisionedThroughput={
        'ReadCapacityUnits': 5,
        'WriteCapacityUnits': 5
    }
)

# Wait until the table exists.
table.meta.client.get_waiter('table_exists').wait(TableName='sourceDistribution')

# Print out some data about the table.
print(table.item_count)
