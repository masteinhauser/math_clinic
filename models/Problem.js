var util = require('util');
var mongo = require('mongoose');
var Schema = mongo.Schema;

// Problem Schema and declaration
var ProblemSchema = new Schema({
   latency: Date,
   correct: Boolean,
   problem: String,
   answer: String,
   result: String
});
mongo.model('Problem', ProblemSchema);
var Problem = mongo.model('Problem');
exports.emptyProblem = {
   "_id": "",
   latency: "",
   correct: false,
   problem: "",
   answer: "",
   result: ""
};

