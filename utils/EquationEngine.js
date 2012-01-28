var util = require('util');

// This is the engine used to parse through the user defined equation and create all possible problems for it.
// These are then selected from randomly to the number of questions to be on the test.

// Equation is the code form to split and build from: [0..9][+][1..5] gives 50 combinations
//                                                  : [0..9][+-][0..9][+][0..9] gives 2000 combinations
//                                                  : [0..9][+-][1,5] gives 40 combinations
var parse = exports.parse = function(equation, callback){
   var eq = [];
   var i = 0;

// Start to parser
   util.log("Equation: "+ equation);

   // Match number: ranges, etc.
   var m = equation.match(/((?:\[[^\]]+\])+)/);

   // Remove first and last bracket
   var substr = m[1].substring(1, m[1].length - 1);

   // Split equation into parts
   eq = substr.split("][");

   if(callback){
      callback(eq);
   } else {
      return eq;
   }
};

// Calculate range defined in number
var range = function(number, callback){
   var range = [];
   var regLower = /\d+/;
   var regUpper = /\.{2,}\d+/;
   var lower = number.match(regLower)[0]; // Grab first match
   var upper = number.match(regUpper)[0].replace('..','');
   var i = 0;

   for(i=lower; i<=upper; i++){
      range.push(i);
   }

   if(callback){
      callback(range);
   } else {
      return range;
   }
};

// Calculate range of specific numbers defined in number
var specific = function(number, callback){
   var reg = /\d,*/g;
   var specific = number.match(reg);

   for(i=0; i<specific.length; i++){
      specific[i] = specific[i].replace(/,/g, '');
   }

   if(callback){
      callback(specific);
   } else {
      return specific;
   }
};

// Add equation part to all previously built equations
var build = exports.build = function(eqParts){
   var i = 0, j = 0, k = 0;
   var orig, insert, inserted = 0;
   var questions = [], newQuestions = [];
   var message;

   // j: Insert or Append each question part
   for(i=0; i<eqParts.length; i++){
      for(j=0; j<questions.length || j===0; j++){
         for(k=0; k<eqParts[i].length; k++){
            oldQuestion = (questions[j] || "");

            pos = j+inserted;
            insert = oldQuestion + eqParts[i][k];

            newQuestions.splice(pos, 1, insert);
            inserted++;
         }
      }
      questions = newQuestions;
      newQuestions = [];
   }

   return questions;
};

var trim = exports.trim = function(questions, count){
   var rand, i = 0, message = "";
   var newQuestions = [];


   if(questions.length < count){
      message = "WARNING: Requested number of questions is larger than generated total. Randomly duplicating questions.";
      for(i = 0; i < count; i++){
         rand = Math.floor(Math.random() * questions.length);
         newQuestions.push(questions[rand]);
      }
   } else { // Cut down questions to number specified in count.
      for(i = 0; i < count; i++){
         rand = Math.floor(Math.random() * questions.length);
         newQuestions.push(questions[rand]);
         questions.splice(rand, 1);
      }
   }

   return {questions: newQuestions, message: message};
};

// Generate array of parts from numbers and operators
var generate = exports.generate = function(eq, callback){
   var i = 0;
   var parts = [];

   //var regNumber = /^[\-]?[0-9]+[\.]?[0-9]+$/;
   var regNumber = /^([0-9]*|\d*\.\d{1}?\d*)$/;
   var regRange = /\d+\.{2,}\d+/;
   var regSpecific = /\d+,*\d+/;
   var regOperator = /[\+\-\*\/]/;

   // i: For each equation part, generate and store possibilities
   for(i=0; i<eq.length; i++){
      // Always enter switch
      switch(eq.length > 0){
         //Single
         case regNumber.test(eq[i]):
            parts.push(eq[i]);
            break;
         // Range
         case regRange.test(eq[i]):
            parts.push(range(eq[i]));
            break;
         // Specific
         case regSpecific.test(eq[i]):
            parts.push(specific(eq[i]));
            break;
         // Operator
         case regOperator.test(eq[i]):
            parts.push(eq[i].split(''));
            break;
         // Error or Unknown
         default:
            util.log("ERROR: Unknown character used in "+eq[i]);
            break;
      } // End switch
   } // End number parts

   if(callback){
      callback(parts);
   } else {
      return parts;
   }
};

var run = exports.run = function(equation, count){
// NOTE: This is the call path. Use it for debugging.
//   var parsedEquation = parse(equation);
//   var parts = generate(parsedEquation);
//   var builtQuestions = build(parts);
//   var subsetQuestions = trim(builtQuestions, count);

   return trim(build(generate(parse(equation))), count);
};

//var equation = '[1][0][+][1,5][+][0..10]';
//var count = 30;

//eq = run(equation, count);

//if(eq.message){
//   util.log(eq.message);
//   util.log(eq.message);
//}

//var z = 0;
//for(z=0; z<eq.questions.length; z++){
//   util.log(eq.questions[z]);
//}

