#!/usr/bin/env bash
# Install necessary packages and whatnot

sudo apt-get update -y
sudo apt-get install nginx -y
sudo apt-get install mysql-server -y

pip3 install gunicorn
pip3 install flask
pip3 install mysqldb

