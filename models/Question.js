var util = require('util');
var mongo = require('mongoose');
var Schema = mongo.Schema;

var QuestionHelper = require('./helpers/Question');

// Question Schema and declaration
var QuestionSchema = new Schema({
   type: QuestionHelper.QuestionType,
   range: String,
   question: String,
   result: String
});

mongo.model('Question', QuestionSchema);
var Question = mongo.model('Question');

exports.emptyQuestion = {
   "_id": "",
   type: "",
   range: "",
   question: "",
   result: ""
};

