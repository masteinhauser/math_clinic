var util = require('util');
var mongo = require('mongoose');
var Schema = mongo.Schema;

var User = require('./User');
var Problem = require('./Problem');

// Test/Worksheet Schema and declaration
var TestSchema = new Schema({
   ts: {type: Date, default: Date.now },
   user: User,
   problems: [Problem]
});

mongo.model('Test', TestSchema);
var Test = mongo.model('Test');

exports.emptyTest = {
   "_id": "",
   ts: "",
   user: "",
   problems: [Problem]
}; 

