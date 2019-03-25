#'''****BeautifulSoup Implementation********'''
# from bs4 import BeautifulSoup
# import requests
# # Here, we're just importing both Beautiful Soup and the Requests library
# page_link = 'https://www.politico.com/story/2019/03/25/trump-mueller-acted-honorably-1235226'
# # this is the url that we've already determined is safe and legal to scrape from.
# page_response = requests.get(page_link, timeout=5)
# # here, we fetch the content from the url, using the requests library
# page_content = BeautifulSoup(page_response.content, "html.parser")
# #we use the html parser to parse the url content and store it in a variable.
# textContent = []
# for i in range(0, 20):
#     paragraphs = page_content.find_all("p")[i].text
#     textContent.append(paragraphs)
#
#
# print(textContent)
# # In my use case, I want to store the speech data I mentioned earlier.  so in this example, I loop through the paragraphs, and push them into an array so that I can manipulate and do fun stuff with the data.
#********************************NEWSAPI*******************************************
import requests
import json
url = ('https://newsapi.org/v2/everything?'
        'q=Russia&'
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
