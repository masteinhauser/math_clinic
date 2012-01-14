var util = require('util');
var mongo = require('mongoose');
var Schema = mongo.Schema;

// User Schema and declaration
var UserSchema = new Schema({
   username: String,
   fname: String,
   lname: String
});

mongo.model('User', UserSchema);
var User = mongo.model('User');

exports.emptyUser = {
   "_id": "",
   username: "",
   fname: "",
   lname: ""
};


