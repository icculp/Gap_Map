#!/usr/bin/node
/*
* Task 6
*/
const $ = window.$;
const jQuery = window.jQuery;

const api_url = 'http://35.188.7.170:5001/api/v1/parcel_coordinates'
var lii;

/* retreives parcel dimensions via internal api
   wrapping contents of add layer inside
  request is asynchronous. Pain in the ass. Have to wait.
 */


$(document).ready(function () {

  mapboxgl.accessToken = 'pk.eyJ1IjoiaWNjdWxwIiwiYSI6ImNrZ2Ewc2x6eTAyanAydmw1NDgzMXR0NXYifQ.nqjI4BmU6QzI8ddfbsfozA';
  var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-95.91362573669322, 36.1905273587632],
  zoom: 11
  });

  map.addControl(
    new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
    })
  );
  
  $.ajax({
    type: 'GET',
    url: api_url,
    data: '',
    async: false,
    success: function (data) {
      lii = data
    }
  });
  
  alert("Still in development/testing, POI's are incomplete and solutions are being considered to improve speed\nLoading may take some time as the layers are loaded. \n\nPlease be patient.\nWait for the completion alert.\n");
  
  
  
  var linee = new Array();
  var polygonn = new Array();
  
  for (i = 0; i < lii.length; i++) {
  
  console.log(i);
  console.log(lii[i]); 
  
  linee.push({
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "LineString",
      "coordinates": lii[i]
    }
  });
  
  polygonn.push(turf.buffer(linee[i], 2000, {units: 'feet'}));
  
  }; /* end first for loop */
  
  
  map.on('load', function() {
    let route = "route";
    let poly = "poly";
  
    for (j = 0; j < lii.length; j++) {
      route = "route" + j.toString();
      poly = "poly" + j.toString();
      /*alert(i);*/
      map.addLayer({
          "id": route,
          "type": "line",
          "source": {
            "type": "geojson",
            "data": linee[j]
          }
      });
        map.addLayer({
          "id": poly,
          "type": "fill",
          "source": {
            "type": "geojson",
            "data": polygonn[j]
          },
          "layout": {
            "fill-sort-key": 0.9,
          },
          "paint": {
            "fill-color": 'red',
            "fill-opacity": .3
          }
      });
    };
  });
});
