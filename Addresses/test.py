#!/usr/bin/env python3
"""
    Test
"""
from bs4 import BeautifulSoup
from selenium import webdriver
import requests

'''
chromedriver = '/usr/local/bin/chromedriver'
options = webdriver.ChromeOptions()
options.add_argument('headless') #open a headless browser 
browser = webdriver.Chrome(executable_path=chromedriver, chrome_options=options)
'''
s = requests.Session()
r = s.get('http://childcarefind.okdhs.org/childcarefind/ChildCareFacilities.aspx')
print(r.headers)
print(dir(r))
print('----------------------')
print(r.text.count('\"__VIEWSTATE\"'))
print('________________________')
#print(r.content)
soup = BeautifulSoup(r.text, 'html.parser')
print(dir(soup))
view_state = soup.find(id='__VIEWSTATE').get('value')
view_generator = soup.find(id='__VIEWSTATEGENERATOR').get('value')
event_valid = soup.find(id='__EVENTVALIDATION').get('value')
cookie = "{}={};".format(list(s.cookies.get_dict())[0], list(s.cookies.get_dict().values())[0])
print('999999999999999999999999999999999999999999')
print(cookie)
header_request = {'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9', 'Accept-Encoding': 'gzip, deflate', 'Accept-Language': 'en-US,en;q=0.9,es-US;q=0.8,es;q=0.7,de-DE;q=0.6,de;q=0.5', 'Cache-Control': 'max-age=0', 'Connection': 'keep-alive', 'Cookie': cookie, 'Host': 'childcarefind.okdhs.org', 'Referer': 'http://childcarefind.okdhs.org/childcarefind/Default.aspx', 'Upgrade-Insecure-Requests': '1', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'}

payload = {'__VIEWSTATE': view_state, 'ctl00$ContentPlaceHolder1$txtZipCode': '74115', 'ctl00$ContentPlaceHolder1$btnSearch': 'Search for Child Care', 'ctl00$ContentPlaceHolder1$ddlStarLevel': 'All', '__VIEWSTATEGENERATOR': view_generator, '__EVENTVALIDATION': event_valid, 'ctl00$ContentPlaceHolder1$rblFacilityType': '', 'ctl00$ContentPlaceHolder1$txtCityName': '', 'ctl00$ContentPlaceHolder1$ddlbCounty': '', 'ctl00$ContentPlaceHolder1$txtFacilityName': ''}
p = requests.post('http://childcarefind.okdhs.org/childcarefind/ChildCareFacilities.aspx', data=payload, headers=header_request)
print('~~~~~~~~~~~~~~~~~~~~~~~~~~~')
print(p.text)
soup2 = BeautifulSoup(p.text, 'html.parser')
print('DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD')
print(soup2.find('maincontentarea'))
print(dir(r))
print(dir(r.connection.get_connection))
print(dir(r.cookies))
print(s.cookies.get_dict())
print('999999999999999999999999999999999999999999')
print(cookie)
print(header_request)
print(soup.find('_ga'))
print(payload)
#print("{}\n\n{}\n\n{}\n\n".format(view_state, view_generator, event_valid))
#print(r.text)
#print(r.text)
#j = r.json()
#print(j)

