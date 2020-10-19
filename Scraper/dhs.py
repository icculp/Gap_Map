#!/usr/bin/env python3
"""
    Scraps DHS Daycare locator website. Prints and returns list of addresses
    Site uses asp.net, and thus was difficult to scrape using requests/beautifulsoup or scrapy.
    Successful using selenium webdriver
"""
from bs4 import BeautifulSoup
import csv
import json
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import requests


def scrapeDHS(zip='', city=''):
    """
        Scrapes DHS Daycare locator website and returns list of addresses
        zip and city can be specified to enter into the search boxes for those items
    """ 
    op = webdriver.ChromeOptions()
    op.add_argument('headless')
    browser = webdriver.Chrome(options=op)
    browser.get('http://childcarefind.okdhs.org/childcarefind/')
    
    """ Search by city and/or zip """
    elem = browser.find_element_by_css_selector('#ctl00_ContentPlaceHolder1_txtCityName') 
    elem.send_keys(city)

    elem = browser.find_element_by_css_selector('#ctl00_ContentPlaceHolder1_txtZipCode')
    elem.send_keys(zip)

    elem.send_keys(Keys.RETURN)

    """ Select elements containing addresses """
    cells = browser.find_elements_by_css_selector("#ctl00_ContentPlaceHolder1_GridView1 > tbody > tr > td:nth-child(7)")

    """ Appends addresses to list and removes empty items """
    addresses = []
    [addresses.append(x.text) for x in cells if x.text != ' ']

    """
        If multuple pages, page next and add addresses, until no next page button found
        Useful for searching by city or zip code with addresses more than 1 page

        Works automatically whether one page or multiple page returned
    """
    while (1):
        try:
            print('Checking Next Page')
            browser.find_element_by_link_text('Next Page').click()
            cells = browser.find_elements_by_css_selector("#ctl00_ContentPlaceHolder1_GridView1 > tbody > tr > td:nth-child(7)")
            [addresses.append(x.text) for x in cells if x.text != ' ']
        except:
            break

    '''print(addresses)'''
    return addresses


def geo_code_bulk(adr):
    """
        Sends bulk geocode request to geocod.io

        Using a separate service for geocode requests will reduce the total number of api requests sent
        to mapbox(or whatever map tile service), reducing the cost if the site gets many visitors

        Sends object of addresses in POST and receives lengthy results in json
        Parses results and dumps relevant info to daycares.json
    """
    ''' adr is only scraped day care addresses. Parks and school csv downloaded via Koordinates
        Need to open csv files, parse out addresses, and include them in bulk geocode request
        Probably a better way to do it, but alas, mvp needs to be finished asap
    '''
    schools_path = 'city-of-tulsa-oklahoma-schools.csv'
    parks_path = 'city-of-tulsa-oklahoma-park-and-recreation-areas.csv'
    with open(schools_path, 'r') as schools:
        schools = csv.reader(schools, delimiter=',')
        ''' addresses are 9th field (8th index)
            skip first row, headers
        ''' 
        schools = list(schools)
        for s in range(1, len(schools)):
            adr.append(schools[s][8])

    with open(parks_path, 'r') as parks:
        parks = csv.reader(parks, delimiter=',')
        parks = list(parks)
        #print(parks)
        for p in range(1, len(parks)):
            ''' addresses 3rd field 2nd index '''
            adr.append(parks[p][2])
    #exit()
    """
        Geocod has free api limit of 2500 a day. Juggling keys...
        ian.culp@csuglobal.edu = f6fd5581fa8785658f6851733614d53afaf587d
        ian.culp@holbertonschool.com = c250c589bcb58f291a8b02892200f88f82898fa
    """
    api_key = 'f6fd5581fa8785658f6851733614d53afaf587d'
    #print(json.dumps(adr))


    ''' Append city/state to addresses for geocode request '''
    for a in range(len(adr)):
        adr[a] += ', Tulsa OK'

    print(adr)
    #exit()

    ''' Bulk geocode - sending addresses, receiving point coordinates for each address (parsing required)
    '''
    print("\n\n\n---\nSending bulk request to convert address to point coordinates\n---\n")
    r = requests.post('https://api.geocod.io/v1.6/geocode?api_key={}'.format(api_key), json=adr)
    #print(dir(r))
    #    print(r.text)
    print(r.status_code)
    j = r.json()
    #print(dir(j))
    #print(j)
    #print(j['results'])

    ''' Parse geocode response, append point coordinates to list '''
    print("\nParsing geocode response\n")
    koor = []
    for result in j['results']:
        koor.append(result['response']['results'][0]['location'])

    
    ''' Query Koordinates api with point coordinates for each address to receive parcel dimension coordinates
        Parse json results and append coordinate lists for each address onto parcel_coordinates master list
    '''
    print("Sending point coordinates to receive parcel dimension coordinates")
    parcel_coordinates = []
    for k in koor:
        r = requests.get('https://koordinates.com/services/query/v1/vector.json?key=f770cdf041a3473bb5c486f1c2b60f46&layer=102094&x={}&y={}&max_results=3&radius=10000&geometry=true&with_field_names=true'.format(k['lng'], k['lat']))
        print(r.status_code)
        j = r.json()
        parcel_coordinates.append(j['vectorQuery']['layers']['102094']['features'][0]['geometry']['coordinates'][0])
    print(parcel_coordinates)


    ''' serialize parcel_coordinates to file '''
    with open('parcel_coordinates', 'w') as pc:
        json.dump(parcel_coordinates, pc)
    return parcel_coordinates



if __name__ == '__main__':
    addresses = scrapeDHS(city='Tulsa')
    #print('Addresses: \n{}'.format(addresses))
    geo_code_bulk(addresses)


""" Old attempts and scrap code:

#cells = browser.find_elements_by_css_selector("#ctl00_ContentPlaceHolder1_GridView1")
#print(dir(browser))
#cells = elem.find_elements_by_xpath("//table[@id='ct100_ContentPlaceHolder1_GridView1']//tbody/tr[2]/td[7]")

    ''' Returned too much additional info asdf adfa
    payload = {}
    for a in range(len(adr)):
        payload.update({a: {"street": adr[a], "city": "Tulsa", "State": "OK"}})
    '''


''' 
chromedriver = '/usr/local/bin/chromedriver'
options = webdriver.ChromeOptions()
options.add_argument('headless') #open a headless browser 
browser = webdriver.Chrome(executable_path=chromedriver, chrome_options=options)
'''
#s = requests.Session()
#r = s.get('http://childcarefind.okdhs.org/childcarefind/ChildCareFacilities.aspx')


#print(cells)
#print(dir(cells))
#print(len(cells))
--------
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
"""
