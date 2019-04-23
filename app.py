from flask import Flask, jsonify
from scrape import read
from db_util import insertJSON, getJSON
import boto3

import config
import db_util

app = Flask(__name__)

@app.route('/')
def index():
    return "Hello, World!"

@app.route('/getSourceDistribution/<key_word>', methods=['GET'])
def getSourceDistribution(key_word):
	data = read(key_word)[1]
	old = getJSON("sourceDistribution")
	body = old['body']
	duplicate = False
	for item in body:
		if item['keyword'] == key_word:
			duplicate = True
	if not duplicate:
		dynamodb = boto3.resource('dynamodb',aws_access_key_id=config.aws_access_key_id, aws_secret_access_key=config.aws_secret_access_key, region_name='us-east-2')
		table = dynamodb.Table("sourceDistribution")
		table.put_item(
			Item={
				'keyword': key_word,
				'publications': str(data['publications'])
			})
	
	return jsonify(data)

@app.route('/getTrending/', methods=['GET'])
def getTrending():
	data = getJSON("trendingTopics")
	# print(data)
	newDict = {}
	for item in data['body']:
		newDict[item['keyword']] = int(item['count'])
	return jsonify(newDict)

@app.route('/getCandidateInfo/', methods=['GET'])
def getCandidateInfo():
	data = getJSON("candidateTable")
	newDict = {}
	for item in data['body']:
		newDict[item['keyword']] = item['publications']
	return jsonify(newDict)

if __name__ == '__main__':
	app.run(debug=True)