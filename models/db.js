var util = require('util');
var mongo = require('mongoose');
var Schema = mongo.Schema;

exports.connect = function(callback){
   var dburl = 'mongodb://127.0.0.1/math_clinic';

   var conn = mongo.connect(dburl, function(err){
      if(err){
         util.log(err);
      }
   });

   mongo.connection.on("open", function(err){
      if(err){
         util.log(err);
      } else {
         util.log("Connected to Mongo@"+mongo.connection.host+":"+mongo.connection.port);
      }
   });
   mongo.connection.on("error", function(err){
      util.log(err);
   });
};

exports.disconnect = function(callback){
   util.log("Disconnected from Mongo!!!");
   mongo.disconnect(callback);
};

exports.setup = function(callback){ 
   callback(null); 
};

var User = require('./User');
var Class = require('./Class');
var Problem = require('./Problem');
var Question = require('./Question');
var Test = require('./Test');

