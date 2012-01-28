var util = require('util');
var mongo = require('mongoose');
var Schema = mongo.Schema;

var dburl = 'mongodb://localhost/math_clinic';

exports.connect = function(callback){
  mongo.connect(dburl);
};

exports.disconnect = function(callback){
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

