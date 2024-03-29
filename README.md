# Gap_Map

This is a map with 2000 foot buffers drawn around the property lines of Tulsa city schools, parks, and daycares. This is to provide a resource to allow registrants to abide by offender registration residency restrictions.

Map currently running at:

http://34.72.128.8:5000/gap_map


=======
Author:

Ian Culp

https://www.linkedin.com/in/ianculp/

Landing page:

http://gapmap.godaddysites.com


=======
After cloning the repo and installing the required packages, run the following from sepearate terminals or within a terminal multiplexer like screen or tmux. The map runs from port 5000 and the parcel coordinates api should run from port 5001, hence the need to set the env variable when starting the app. Ran into an issue with newer version of turf.js. This was originally built in python3.5 and turn 5.1.6. 

The run_script should start everything if you have the right dependencies installed.

python3 -m web_dynamic.gap_map

API_PORT=5001 python3 -m api.v1.app


Serving Tulsa city gap map at:

http://34.72.128.8:5000/gap_map

http://shorturl.at/dquB5

JSON array of parcel dimension coordinates served at the following API:

http://34.72.128.8:5001/api/v1/parcel_coordinates

Using Google cloud compute engine vm instance:

34.72.128.8

Used selenium webdriver to scrape daycare addresses from the DHS locator site, which uses asp.net
School and park addresses parsed out of a koordinates data export via .csv
All addresses sent via POST geocode bulk request to geocod.io, point coordinates returned
Point coordinates sent to Koordinates parcel dimension layer API query, and parcel dimension coordinates parsed and appended to list. List serialized to json file. 
Coordinates list served by API endpoint :5001/parcel_dimensions 
Coordinates deserialized from API GET request in jQuery and used to create lines along the dimensions of each parcel, which Turf.js uses to create buffer polygons, which are then merged via turf.union() to create a single layer to add to the map.

 
Initial tests:

https://gapmap.godaddysites.com/gap-map
