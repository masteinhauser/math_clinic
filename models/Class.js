var util = require('util');
var mongo = require('mongoose');
var Schema = mongo.Schema;

var User = require('./User');

// Class Schema and declaration
var ClassSchema = new Schema({
   classname: String,
   school: String,
   teacher: User,
   students: [User]
});

mongo.model('Class', ClassSchema);
var Class = mongo.model('Class');

exports.emptyClass = {
   "_id": "",
   classname: "",
   school: "",
   teacher: User,
   students: [User]
};


