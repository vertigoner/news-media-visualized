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
	data = read(key_word)
	old = getJSON("sourceDistribution")
	body = old['body']
	duplicate = False
	for item in body:
		if item['keyword'] == key_word:
			duplicate = True
	if not duplicate:
		insertJSON("sourceDistribution", data)

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