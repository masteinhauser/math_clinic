#!/bin/bash

log=/var/log/math_clinic.log
env=${1:production}

node app.js $1 & 2>&1 >> $log
