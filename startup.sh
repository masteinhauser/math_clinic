#!/bin/bash

# Desc: This script recursivley calls itself to start a screen session in which we then launch the node application.
#       Benefits of doing this are that we can now watch in real-time error and debugging out and interacto with the server as needed.

if [ "x$2" != "xscreen" ] ; then
   /usr/bin/screen -dmS math_clinic /bin/bash ./startup.sh $1 screen
else
   node app.js $1
fi
