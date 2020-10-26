#!/usr/bin/python3
""" objects that handle all default RestFul API actions for Places """
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
import json


@app_views.route('/parcel_coordinates', methods=['GET'],
                 strict_slashes=False)
def get_parcel_coordinates():
    """ Retreives list of all parcel dimension coordinates """
    with open('/home/vagrant/Gap_Map/Addresses/parcel_coordinates', 'r') as parcels:
        parcels = json.load(parcels)
    #print(parcels)
    #print(len(parcels))
    ''' some items are 1 too many levels deep (nested list), so need to 
        clean the data by redefining those indexes
    '''
    for p in range(len(parcels)):
        if type(parcels[p][0][0]) != float:
            print('here')
            print(p)
            parcels[p][0][0]
            parcels[p] = parcels[p][0]
            parcels[p][0][0]
    return jsonify(parcels)


