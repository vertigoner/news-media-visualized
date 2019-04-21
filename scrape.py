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

def read(keyword):
    q = 'q=' + keyword + "&"
    url = ('https://newsapi.org/v2/everything?'
            +q+
           'from=2019-03-25&'
           'sortBy=popularity&'
           'apiKey=51f9df310d85434c9fbbca122bc636bd')

    response = requests.get(url)

    # print(type(response.json()))
    dict = response.json()
    articles = dict["articles"]
    sources = []
    finalDict = {}
    for a in articles:
        source = a["source"]
        name = source['name']
        if name not in sources:
            finalDict[name] = 1
            sources.append(name)
        else:
            finalDict[name] += 1
    print(finalDict)
    jsonObject = {"keyword": keyword, "publications": str(finalDict)}
    return jsonOsbject

# keyword = "Russia"
keywords = ['Mueller', 'Election 2020', 'Indian Elections', 'Bernie Sanders', 'Trump',
'Green New Deal', 'Biden', 'Cory Booker', 'Pete Buttigieg']
for k in keywords:
    read(k)
#read(keyword)
