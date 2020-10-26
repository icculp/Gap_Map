# Gap_Map

This is a map with 2000 foot buffers drawn around the property lines of Tulsa city schools, parks, and daycares. This is to provide a resource to allow registrants to abide by offender registration residency restrictions.

Landing page:

http://gapmap.godaddysites.com


Serving Tulsa city gap map at:

http://35.188.7.170:5000/gap_map

http://shorturl.at/dquB5

JSON array of parcel dimension coordinates served at the following API:

http://35.188.7.170:5001/api/v1/parcel_coordinates

Using Google cloud compute engine vm instance:

35.188.7.170

Used selenium webdriver to scrape daycare addresses from the DHS locator site, which uses asp.net
School and park addresses parsed out of a koordinates data export via .csv
All addresses sent via POST geocode bulk request to geocod.io, point coordinates returned
Point coordinates sent to Koordinates parcel dimension layer API query, and parcel dimension coordinates parsed and appended to list. List serialized to json file. 
Coordinates list served by API endpoint :5001/parcel_dimensions 
Coordinates deserialized from API GET request in jQuery and used to create lines along the dimensions of each parcel, which Turf.js uses to create buffer polygons, which are then merged via turf.union() to create a single layer to add to the map.

 
Initial tests:

https://gapmap.godaddysites.com/gap-map
