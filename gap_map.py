# -*- coding: utf-8 -*-
"""
Created on Fri Dec 27 14:50:53 2019

@author: Ian
"""

import argparse
import geopy
import json
import requests

from geopy.distance import vincenty

wikimapia_api_key = "C7820673-5EA3C999-8466B6BE-D88E4218-4BC9FD76-9D3FECDE-835F2457-4EB2AEB7"

ap = argparse.ArgumentParser()
ap.add_argument("-c","--city",required=True,help="Pass in a city name like: Tulsa Oklahoma")
args = vars(ap.parse_args())

print ("[*] Attempting to resolve %s" % args['city'])

#find the lcoation
geosearch = geopy.GoogleV3(api_key="AIzaSyDGmKWqcPwiz2YAgpAh0iG-RcsLko6t-7o")
geo_result = geosearch.geocode(args['city'])

if geo_result is not None:
    
    latitude = geo_result.latitude
    longitude = geo_result.longitude
    
    url = "http://api.wikimapia.org/?key=%s&function=place.getnearest&lat=%f&lon=%f&format=json&count=1&category=88" % (wikimapia_api_key, latitude, longitude)
    
    response = requests.get(url)
    
    if response.status_code == 200:
        
        nearest = json.loads(response.content)
        
        if not len(nearest['places']):
            print ("[!] Could not find Wikipamia entry. Sorry")
        else:
            
            location = nearest['places'][0]['location']
            
            #bounding box contained in location result
            #so let's measure distance from center to corner
            
            distance_to_ne = vincenty((location['lat'],location['lon']),(location['north'],location['east'])).m
            distance_to_sw = vincenty((location['lat'],location['lon']),(location['south'],location['west'])).m
            
            #now take greater of two measurements
            if distance_to_ne > distance_to_sw:
                radius = distance_to_ne
            else:
                radius = distance_to_sw
                
            print ("[*] Search radius of %f meters" % radius)
            
            url = "http://api.wikimapia.org/?key=%s&function=place.search&distance=%f&lat=%f&lon=%f&category=203&count=100&format=json" % (wikimapia_api_key,radius,location['lat'],location['lon'])
            
            all_schools = []
            
            response = requests.get(url)
            
            if response.status_code == 200:
                
                school_result = json.loads(response.content)
                
                #all_schools.append(dict(school_result['places']))
                
                for item in school_result:
                    all_schools.append(school_result['places'])
                
                page = 2
    
                
                while len(all_schools) < len(school_result):
                    page_url = "%s&page=%d" % (url,page)
                    
                    response = requests.get(page_url)
                    
                    if response.status_code == 200:
                        
                        school_result = json.loads(response.content)
                        
                        #all_schools.extend(dict(school_result['places']))
                        
                        for item in school_result:
                            all_schools.append(school_result['places'])
                        
                    else:
                        print ("[!] Error retrieving page %d results." % page)
                        break
                    
                    print ("[*] Retrieved %d schools" % len(all_schools))
                    
                    fd = open("schools.json", "wb")
                    fd.write(json.dumps(all_schools))
                    fd.close()
                    
    