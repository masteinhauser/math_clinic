var util = require('util');
var mongo = require('mongoose');
var Schema = mongo.Schema;

var dburl = 'mongodb://localhost/match_clinic';

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

// END of database setup, below is excess code


exports.add = function(author, note, callback){
  var newNote = new Note();
  newNote.author = author;
  newNote.note = note;
  newNote.save(function(err){
    if(err){
      util.log('FATAL '+err);
      callback(err);
    } else {
      callback(null);
    }
  });
};

exports.del = function(id, callback){
  exports.findNoteById(id, function(err, doc){
    if(err){
      callback(err);
    } else {
      util.log(util.inspect(doc));
      doc.remove();
      callback(null);
    }
  });
};

exports.edit = function(id, author, note, callback){
  exports.findNoteById(id, function(err, doc){
    if(err){
      callback(err);
    } else {
      doc.ts = new Date();
      doc.author = author;
      doc.note = note;
      doc.save(function(err){
        if(err){
          util.log('FATAL '+err);
          callback(err);
        } else {
          callback(null);
        }
      });
    }
  });
};

exports.allNotes = function(callback){
  Note.find({}, callback);
};

exports.forAll = function(doEach, done){
  Note.find({}, function(err, docs){
    if(err){
      util.log('FATAL '+err);
      done(err, null);
    }

    docs.forEach(function(doc){
      doEach(null, doc);
    });

    done(null);
  });
};

var findNoteById = exports.findNoteById = function(id, callback){
  Note.findOne({ _id: id }, function(err, doc){
    if(err){
      util.log('FATAL '+err);
      callback(err, null);
    }
    callback(null, doc);
  });
};
