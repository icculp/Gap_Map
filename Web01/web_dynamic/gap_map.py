#!/usr/bin/python3
""" Starts a Flash Web Application """
from models import storage
import uuid
from os import environ
from flask import Flask, render_template
app = Flask(__name__)
import sys
sys.path.append('/home/vagrant/Gap_Map/Addresses')
from dhs import scrapeDHS, geo_code_bulk
from flask_cors import CORS


cors = CORS(app)

@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()


@app.route('/gap_map/', strict_slashes=False)
def hbnb():
    """ HBNB is alive! """
    #addr = scrapeDHS(zip='74115')
    list_daycares = []
    #geo_code_bulk(addr)
    return render_template('101-hbnb.html',
                           list_daycares=list_daycares,
                           cache_id=uuid.uuid4())


if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5000, debug=True)
