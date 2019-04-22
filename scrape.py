#'''****BeautifulSoup Implementation********'''
# from bs4 import BeautifulSoup
# import requests
# page_link = 'https://www.politico.com/story/2019/03/25/trump-mueller-acted-honorably-1235226'
# page_response = requests.get(page_link, timeout=5)
# page_content = BeautifulSoup(page_response.content, "html.parser")
# textContent = []
# for i in range(0, 20):
#     paragraphs = page_content.find_all("p")[i].text
#     textContent.append(paragraphs)
#
#
# print(textContent)
#********************************NEWSAPI*******************************************
import requests
import json
import db_util
from newsapi import NewsApiClient

def read(keyword):
    newsapi = NewsApiClient(api_key='51f9df310d85434c9fbbca122bc636bd')
    everything = newsapi.get_everything(q= keyword,from_param='2019-03-25',
                                          to='2019-04-21',
                                          language = 'en', page = 1, page_size = 100)
    articles = everything["articles"]
    sources = []
    finalDict = {}
    count = 0
    for a in articles:
        source = a["source"]
        name = source['name']
        if name not in sources:
            finalDict[name] = 1
            sources.append(name)
        else:
            finalDict[name] += 1
        count += 1
    jsonObject = {"keyword": keyword, "publications": str(finalDict)}
    # print(jsonObject)
    return sources, jsonObject

def addSourceDistributions():
    keywords = ['Mueller', 'Election 2020', 'Indian Elections', 'Bernie Sanders', 'Trump',
    'Green New Deal', 'Biden', 'Cory Booker', 'Pete Buttigieg', 'Donald Trump', 'Russia', 'Sri Lanka', 'Notre Dame']
    for k in keywords:
        v = read(k)
        db_util.insertJSON('sourceDistribution', v)

def top(keyword):
    newsapi = NewsApiClient(api_key='51f9df310d85434c9fbbca122bc636bd')
    headlines = newsapi.get_top_headlines(q= keyword,
                                          language='en', page_size = 100, page = 1)
    articles = headlines["articles"]
    sources = []
    finalDict = {}
    count = 0
    for a in articles:
        count += 1
    jsonObject = {"keyword": keyword, "count": count}

    # print(jsonObject)
    print("total count for"+ keyword + ":", count)
    return jsonObject

def addTopHeadlines():
    keywords = ['Mueller', 'Election 2020', 'Indian Elections', 'Bernie Sanders', 'Trump',
    'Green New Deal', 'Biden', 'Cory Booker', 'Pete Buttigieg', 'Donald Trump', 'Russia', 'Sri Lanka', 'Notre Dame', 'Brexit', 'Easter', 'Conway', 'Wall']
    for k in keywords:
        random, v = top(k)
        db_util.insertJSON('trendingTopics', v)
        print(k + " added")

def addRunners():
    keywords = ['Cory Booker', 'Pete Buttigieg', 'Julian Castro', "John Delaney", "Tulsi Gabbard", "Kirsten Gillibrand", "Mike Gravel", "Kamala Harris", "John Hickenlooper", 'Jay Inslee', 'Amy Klobuchar', 'Wayne Messam', 'Beto O\'Rourke', 'Bernie Sanders', 'Eric Swalwell', 'Donald Trump', 'Elizabeth Warren', 'Bill Weld', 'Marianne Williamson', "Andrew Yang"]
    allSources = []
    for k in keywords:
        sources, v = read(k)
        db_util.insertJSON('candidateTable', v)

def checkSources():
    keywords = ['Cory Booker', 'Pete Buttigieg', 'Julian Castro', "John Delaney", "Tulsi Gabbard", "Kirsten Gillibrand", "Mike Gravel", "Kamala Harris", "John Hickenlooper", 'Jay Inslee', 'Amy Klobuchar', 'Wayne Messam', 'Beto O\'Rourke', 'Bernie Sanders', 'Eric Swalwell', 'Donald Trump', 'Elizabeth Warren', 'Bill Weld', 'Marianne Williamson', "Andrew Yang"]
    allSources = []
    for k in keywords:
        sources, v = read(k)
        for source in sources:
            if source not in allSources:
                allSources.append(source)
    allSources = set(allSources)
    print(allSources)
    print("Size: ", len(allSources))
# addTopHeadlines()
# addSourceDistributions()
# addRunners()
