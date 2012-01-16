// This is the engine used to parse through the user defined equation and create all possible problems for it.
// These are then selected from randomly to the number of questions to be on the test.

// Equation is the code form to split and build from: [0..9]+[1..5] gives 50 combinations
//                                                  : [0..9]+[0..9]+[0..9] gives 300 combinations
//                                                  : [0..9]+[1,5] gives 20 combinations
var parse = exports.parse = function(equation, count, callback){
   var eq = [];
   var numbers = [], operators = [];
   var i = 0;

// Start to parser
   util.log("Equation: "+eq+'<br/>');

   // Remove operators
   var s = eq.replace(/[\+\-\*\/]/g, '');

   // Match number: ranges, etc.
   var m = s.match(/((?:\[\d[^\]]+\])+)/);

   // Remove first and last bracket
   var substr = m[1].substring(1, m[1].length - 1);

   // Split equation into parts
   numbers = substr.split("][");

   // TODO: Split correct into array based on ][ brackets and not just operator
   // TODO: i.e. Add an empty entry for ][ but add proper operator for ]+[ or ]*[
   // Strip out non-operators
   var o = eq.replace(/((?:\[\d[^\]]+\])+)/g, '');

   // Split operators into array
   operators = s.split("");

   if(callback){
      callback(numbers, operators);
   } else {
      return [numbers, operators];
   }
};

// Calculate range defined in number
var range = function(number, callback){
   var range = [];
   var regLower = /\d+/;
   var regUpper = /\.+\d+/;
   var lower = number.match(regLower)[0]; // Grab first match
   var upper = number.match(regUpper)[0].replace('.','');
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

// Generate list of equations from numbers and operators then randomly choose count from total
var generate = exports.generate = function(numbers, operators, count, callback){
   var i = 0, j = 0, k = 0;
   var eq = [];// Array of Arrays
   var questions = [];

   var regNumber = /^[\-]?[0-9]+[\.]?[0-9]+$/;
   var regRange = /\d+.*\d+/;
   var regSpecific = /\d+,*\d+/;

   // i: For each number part, generate equation and store possibilities
   for(i=0; i<numbers.length; i++){
      // Always enter switch
      switch(true){
         //Single
         case regNumber.test(numbers[i]):
            eq[i] = numbers[i];
            break;
         // Range
         case regRange.test(numbers[i]):
            eq[i] = range(numbers[i]);
            break;
         // Specific
         case regSpecific.test(numbers[i]):
            eq[i] = specific(numbers[i]);
            break;
         // Error or Unknown
         default:
            util.log("ERROR: Unknown character used in "+numbers[i]);
            break;
      } // End switch
   } // End number parts

   // TODO: Fix to allow varying length number parts
   // j: Insert or Append each question part
   for(j=0; j<eq.length; j++, k<eq.length ? k++ : k = 0){
      for(k=0; ; k<eq[j].length ? k++ : k = 0){

      }
      // Append operator to question
      questions[j] += operators[i];

      // k: If we run out of pieces to append, loop over and continue
      questions[j] += eq[k];
   }

   return questions;
};

var equation = '[09]+[1,5]-[0..99]';
var count = 10;

parse(equation, count, generate);


