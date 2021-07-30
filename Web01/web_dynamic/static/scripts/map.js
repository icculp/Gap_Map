const $ = window.$;
const jQuery = window.jQuery;

const api_url = 'http://34.72.128.8:5001/api/v1/parcel_coordinates';
const tulsa_city_url = 'http://polygons.openstreetmap.fr/get_geojson.py?id=184985&params=0';
var coordinates_array;
var tulsa_city_poly;


$(document).ready(function () {
  mapboxgl.accessToken = 'pk.eyJ1IjoiaWNjdWxwIiwiYSI6ImNrZ2Ewc2x6eTAyanAydmw1NDgzMXR0NXYifQ.nqjI4BmU6QzI8ddfbsfozA';
  var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-95.95, 36.17],
  zoom: 11,
  interactive: true,
  });
  /*center: [-95.9928, 36.1540],
  center: [-95.91362573669322, 36.1905273587632],*/
  /* Adds geocoder/search for address feature */
  map.addControl(
    new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
    })
  );
  /* Adds zoom control feature */
  map.addControl(new mapboxgl.NavigationControl());
  /* Adds scale bar */
  map.addControl(new mapboxgl.ScaleControl({position: 'bottom-left', unit: 'imperial'}));
  /* Adds fullscreen feature */
  map.addControl(new mapboxgl.FullscreenControl());
  /* retrieves list of parcel dimension coordinates from our API */
  $.ajax({
    type: 'GET',
    url: api_url,
    data: '',
    async: false,
    success: function (data) {
      coordinates_array = data
    }
  });
  alert("Still in development/testing, buffered addresses are incomplete and some might be inaccurate\nLoading may take some time as the layers are loaded. \nPlease be patient. You will be notified once loading is complete\n");
  alert("This is only intended as an aid - not a final authority.\n\nYOU MUST VERIFY ADDRESSES WITH TPD\n\nThis is only intended as an interactive tool to assist in the process\n");
  var parcels = new Array();
  var lines = new Array();
  var buffers = new Array();
  var buffy;
  var parcy;
  /* Loop through parcel dimensions, creating buffers through turf.js, and appending these geojson buffer objects to  */
  for (i = 0; i < coordinates_array.length; i++) {
   /**console.log(i);
   console.log(coordinates_array[i]); */
  console.log(i);
   lines.push({
     "type": "Feature",
     "properties": {},
     "geometry": {
       "type": "LineString",
       "coordinates": coordinates_array[i]
     }
   });
   buffers.push(turf.buffer(lines[i], 2300, {units: 'feet'}));
   parcels.push(turf.lineToPolygon(lines[i]));
   console.log(parcels);
    console.log("HEREEEEEEEEEEEEEEEEEE");
  }; /* end first for loop */
  map.on('load', function() {
    let route = "route";
    let poly = "poly";
        /* merges parcels and buffer polygon shapes into one layer each using turf.union. Uses cascading join */
        console.log("parcels length:");
        console.log(parcels.length);
        console.log(...parcels);
        //parcy = turf.union(...parcels);
        //buffers = turf.featureCollection(buffers);
        buffy = turf.union(...buffers);
        /**buffy = turf.union.apply(this, ...buffers);*/
        console.log(buffy);
        console.log(buffy.length);
            /* draw buffers */
            map.addLayer({
              "id": poly,
              "type": "fill",
              "source": {
                "type": "geojson",
                "data": buffy
              },
              "layout": {
                "fill-sort-key": 0.9,
              },
              "paint": {
                "fill-color": 'red',
                "fill-opacity": .3
              }
          });
          /* draw merged parcel outline */
          console.log("parcy");
          console.log(parcy);
          /**map.addLayer({
              "id": "parcel_outlines",
              "type": "fill",
              "source": {
                "type": "geojson",
                "data": parcy
              },
              "layout": {
                "fill-sort-key": 0.9,
              },
              "paint": {
                "fill-color": 'red',
                "fill-opacity": .3
              }
          });*/
        alert('Loading complete');
     
  });/** end map.on('load')*/
       /** }*/
   /** };*/
});

  /* retrieves geojson coordinates of Tulsa City boundary */
  /* failing and breaking map -  need to troubleshoot */
  /*$.ajax({
    type: 'GET',
    headers: {"Access-Control-Allow-origin:": "*"},
    url: tulsa_city_url,
    data: '',
    async: false,
    success: function (data2) {
        tulsa_city_poly = data2
      }
    });*/
    /**for (j = 0; j < coordinates_array.length; j++) {
      route = "route" + j.toString();
      poly = "poly" + j.toString();
      if (j == coordinates_array.length - 1) {
        /*buffers = turf.featureCollection(buffers);*/
        /**console.log(buffers);*/

          /* tulsa city boundary drawn - NOT WORKING */
          /* not working currently, ajax get request is failing above */
           /* map.addLayer({
              "id": 'tulsa_city_boundary',
              "type": "fill",
              "source": {
                "type": "geojson",
                "data": tulsa_city_poly
              },
              "layout": {
                "fill-sort-key": 0.9,
              },
              "paint": {
                "fill-color": 'orange',
                "fill-opacity": .1
              }
          });*/

  /*$.ajax({
    type: 'GET',
    headers: {"Access-Control-Allow-origin:": "*"},
    url: tulsa_city_url,
    data: '',
    beforeSend: function(request) {
      request.withCredentials = false
    },
    async: false,
    success: function (da) {
        tulsa_city_poly = da
      }
    });*/
      /*p.addLayer({
          "id": route,
          "type": "line",
          "source": {
            "type": "geojson",
            "data": linee[j]
          }
      });*/
    
    /*alert("here");*/
    /*testy = {
"type": "FeatureCollection",
"name": "test_5406_buffer",
"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::3857" } },
"features": [
{ "type": "Feature", "properties": { "ACCOUNTNO": "R90327032722480", "VAC_SALE": "1", "STREET": "E APACHE ST N", "EXTERIOR": "Frame Siding\/Brick\/Stone Veneer", "POOLSF": null, "BLTASSF": 1820.0, "BATHS": 1.1, "CONDITION": "Fair", "FOUNDATION": "Conventional", "ZONING": "RS3", "NAME2": null, "DEEDTYPE": "GWD S", "NAME1": "OSBORNE, DANIEL", "PORCHSF": 91.0, "DOCDT": "2016-08-08", "ROOMS": null, "PERCREM": null, "LAT": 36.19095, "PERCCOMP": 1.0, "EXCLUDEREA": "19 Not Fair Cash Value", "ACCT_BLDG": "R903270327224801", "TOTALLANDV": 11937.0, "SITECITY": "TULSA", "GROSSSF": 229557.0, "BLOCK": null, "ROOFTYPE": "Hip\/Gable", "ROOFCOVER": "Composition Shingle", "SEQNO": 250563577.0, "LOAD_DATE": "Thu May 09 07:57:33 2019", "PROP_ADD": "5406 E APACHE ST N", "SPRINKLERS": null, "LEAID": "1537", "INTERIOR": "Drywall", "RANGE": "13", "RECPTNO": "2016073565", "LEADESC": "Single-Family", "MEZSQFT": null, "PAGE": null, "STREETDIR": "E", "STORMSHELT": null, "TAXABL_VAL": 52000.0, "QUALITY": "Fair", "APPRAISER": "550", "LANDDOLPER": 0.052, "STORYHT": 8.0, "STLength": 1907.94499049, "SUBNAME": null, "SECTION": "27", "EFFAGE": null, "GRANTOR": "FURGERSON, LINDA", "VALIDINV": "0", "ADDITHMSTD": null, "BSMNTSFFIN": null, "IMPSFTOTAL": 1820.0, "GARAGESF": 576.0, "ACCTTYPE": "Residential", "BLDGID": "1", "CONFIRMUN": "1", "TOTALIMPVA": 40063.0, "BALCONYSF": null, "ACCT_NUM": "90327032722480", "SNRFREZ": null, "CONDOSF": null, "IMPDOLPER": 22.01, "HVAC": null, "CARPORTSF": null, "VETEXEMPT": null, "STATE": "OK", "STORIES": 2.0, "PERCOFLAND": 1.0, "UNITS": null, "INCR_DIST": null, "TOWNSHIP": "20", "PAR_TYPE": "PARCEL", "PARCELNB": "90327032722480", "AREAID": "T-1A", "BUSINESSNA": null, "ADDRESS1": "C\/O THOMASINE WILLIAMS & SHELLY STILLMAN", "ADDRESS2": "2643 E 27TH ST N", "RCNLDSUM": 11222.0, "BOOK": null, "OWNER": "OSBORNE, DANIEL", "YRBLT": 1920.0, "MKT_VAL": 52000.0, "SF": 1820.0, "STREETNAME": "APACHE", "OWNERPERCE": 1.0, "INCOME_VAL": null, "TR_SEC": "0327", "PRIMARYOWN": 1.0, "GRANTEE": "OSBORNE, DANIEL", "LON": -95.91462, "ZIPCODE": "741101812", "ADJYRBLT": 1920.0, "Census": "1", "STREETNO": "5406", "LOT": null, "NEIGHBORHD": "99307", "HVACTYPE": "None", "TOTALACCTV": 52000.0, "BLDG1_OCC": null, "GROSSACRES": 5.2699, "STArea": 188145.388794, "BLTASOCCDE": "2 Story", "CLASS": null, "HOMESTEAD": null, "NETSF": null, "LEGAL": "BEG NEC NE NW TH S396 W658.61 N396.61 E636.11 POB LESS BEG 50S NEC NE NW TH S55 W335.73 NW308.10 E638.81 POB  SEC 27 20 13  5.27ACS", "FLOORCOVER": "Allowance", "COUNTY": "TULSA", "BSMNTSF": 740.0, "SUBNO": null, "CITY": "TULSA", "YRREM": null, "STREETSUF": "ST N", "PROPTYPE": "Residential", "SALEP": 40000.0, "SALEDT": "2016-08-03", "ADJSALEP": 40000.0 }, "geometry": { "type": "MultiPolygon", "coordinates": [ [ [ [ -10677052.432794284075499, 4326259.821823123842478 ], [ -10677287.897840723395348, 4326258.452980730682611 ], [ -10677482.064381778240204, 4326289.013219564221799 ], [ -10677656.412868939340115, 4326379.772124843671918 ], [ -10677792.817201314494014, 4326521.293967584148049 ], [ -10677877.096133448183537, 4326698.865461527369916 ], [ -10677900.487625293433666, 4326894.025426613166928 ], [ -10677899.988335033878684, 4326905.728991044685245 ], [ -10677899.920716581866145, 4326907.316026756539941 ], [ -10677895.031371830031276, 4327021.174103274010122 ], [ -10677850.999961718916893, 4327223.884723415598273 ], [ -10677741.544246198609471, 4327400.094277453608811 ], [ -10677579.338511565700173, 4327529.398802691139281 ], [ -10677383.165165942162275, 4327596.825644982978702 ], [ -10677175.739854050800204, 4327594.567198310047388 ], [ -10677115.666842862963676, 4327583.520157952792943 ], [ -10677044.20462778583169, 4327583.428961371071637 ], [ -10676855.954702518880367, 4327553.381548386067152 ], [ -10676686.190284479409456, 4327466.658288774080575 ], [ -10676551.513060169294477, 4327331.740066722035408 ], [ -10676465.093451766297221, 4327161.820872181095183 ], [ -10676435.382648648694158, 4326973.517527632415295 ], [ -10676435.398927306756377, 4326941.704414705745876 ], [ -10676435.420717734843493, 4326879.810439417138696 ], [ -10676435.422058012336493, 4326869.396847310476005 ], [ -10676465.056672694161534, 4326681.719299921765924 ], [ -10676551.033286668360233, 4326512.281718403100967 ], [ -10676684.999514622613788, 4326377.544485431164503 ], [ -10676853.940915733575821, 4326290.596942788921297 ], [ -10677041.445309853181243, 4326259.88579876627773 ], [ -10677043.139072462916374, 4326259.875860678963363 ], [ -10677052.432794284075499, 4326259.821823123842478 ] ] ] ] } }
]
};
*/

/*
{ "type": "Feature", 

    "properties": {}, 

    "geometry": { "type": "MultiPolygon",
                  "coordinates": [ [ -10677052.432794284075499, 4326259.821823123842478 ], [ -10677287.897840723395348, 4326258.452980730682611 ], [ -10677482.064381778240204, 4326289.013219564221799 ], [ -10677656.412868939340115, 4326379.772124843671918 ], [ -10677792.817201314494014, 4326521.293967584148049 ], [ -10677877.096133448183537, 4326698.865461527369916 ], [ -10677900.487625293433666, 4326894.025426613166928 ], [ -10677899.988335033878684, 4326905.728991044685245 ], [ -10677899.920716581866145, 4326907.316026756539941 ], [ -10677895.031371830031276, 4327021.174103274010122 ], [ -10677850.999961718916893, 4327223.884723415598273 ], [ -10677741.544246198609471, 4327400.094277453608811 ], [ -10677579.338511565700173, 4327529.398802691139281 ], [ -10677383.165165942162275, 4327596.825644982978702 ], [ -10677175.739854050800204, 4327594.567198310047388 ], [ -10677115.666842862963676, 4327583.520157952792943 ], [ -10677044.20462778583169, 4327583.428961371071637 ], [ -10676855.954702518880367, 4327553.381548386067152 ], [ -10676686.190284479409456, 4327466.658288774080575 ], [ -10676551.513060169294477, 4327331.740066722035408 ], [ -10676465.093451766297221, 4327161.820872181095183 ], [ -10676435.382648648694158, 4326973.517527632415295 ], [ -10676435.398927306756377, 4326941.704414705745876 ], [ -10676435.420717734843493, 4326879.810439417138696 ], [ -10676435.422058012336493, 4326869.396847310476005 ], [ -10676465.056672694161534, 4326681.719299921765924 ], [ -10676551.033286668360233, 4326512.281718403100967 ], [ -10676684.999514622613788, 4326377.544485431164503 ], [ -10676853.940915733575821, 4326290.596942788921297 ], [ -10677041.445309853181243, 4326259.88579876627773 ], [ -10677043.139072462916374, 4326259.875860678963363 ], [ -10677052.432794284075499, 4326259.821823123842478 ] ]  } 

    };*/
    /*alert(testy);

       map.addLayer({
          "id": "cantbenamedthis191919191",
          "type": "fill",
          "source": {
            "type": "geojson",
            "data": testy
          },
          "layout": {
            "fill-sort-key": 0.9,
          },
          "paint": {
            "fill-color": 'red',
            "fill-opacity": .3
          }
      });


      alert(polygonn[0]);*/
        /*p.addLayer({
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
            "fill-opacity": .1
          }
      });*/
