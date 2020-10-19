#!/usr/bin/python3
""" Starts a Flash Web Application """
from models import storage
import uuid
from models.state import State
from models.city import City
from models.amenity import Amenity
from models.place import Place
from models.review import Review
from os import environ
from flask import Flask, render_template
app = Flask(__name__)
# app.jinja_env.trim_blocks = True
# app.jinja_env.lstrip_blocks = True
import sys
sys.path.append('/home/vagrant/Gap_Map/Scraper')
from dhs import scrapeDHS, geo_code_bulk

@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()


@app.route('/gap_map/', strict_slashes=False)
def hbnb():
    """ HBNB is alive! """
    states = storage.all(State).values()
    states = sorted(states, key=lambda k: k.name)
    st_ct = []

    for state in states:
        st_ct.append([state, sorted(state.cities, key=lambda k: k.name)])

    amenities = storage.all(Amenity).values()
    amenities = sorted(amenities, key=lambda k: k.name)

    places = storage.all(Place).values()
    places = sorted(places, key=lambda k: k.name)

    reviews = storage.all(Review).values()
    reviews = sorted(reviews, key=lambda k: k.text)

    #addr = scrapeDHS(zip='74115')
    list_daycares = []
    #geo_code_bulk(addr)
    return render_template('101-hbnb.html',
                           states=st_ct,
                           amenities=amenities,
                           places=places,
                           reviews=reviews,
                           list_daycares=list_daycares,
                           cache_id=uuid.uuid4())


if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5000, debug=True)
