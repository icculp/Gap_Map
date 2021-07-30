#!/usr/bin/env bash
# Install necessary packages and whatnot

sudo apt-get update -y
sudo apt-get install nginx -y
sudo apt-get install mysql-server -y
sudo apt-get install nodejs -y
sudo apt-get install npm -y
sudo apt-get install screen -y

npm install -g browserify
npm install turf-merge
npm install @turf/turf
npm install @turf/union

pip3 install gunicorn
pip3 install flask
pip3 install mysqldb
pip3 install sqlalchemy
pip3 install flasgger
pip3 install flask_cors

