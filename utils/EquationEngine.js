// This is the engine used to parse through the user defined equation and create all possible problems for it.
// These are then selected from randomly to the number of questions to be on the test.

// Equation is the code form to split and build from: [0..9]+[1..5] gives 50 combinations
//                                                  : [0..9]+[0..9]+[0..9] gives 300 combinations
//                                                  : [0..9]+[1,5] gives 20 combinations
var parse = exports.parse = function(equation, count, callback){
   var eq = [];
   var numbers = [], operators = [];
   var questions = [];

//   Possible start, gets close but missing operations
   //   var s = '[0..9][1,5][0..99]';
   //   var m = s.match(/((?:\[[^\]]+\])+)/);
   //   document.write(m+'<br/>');
   //   var substr = m[1].substring(1, m[1].length - 1);
   //   document.write(substr+'<br/>');
   //   var array = substr.split("][");
   //   for(var i = 0; i < array.length; i++){
   //       document.write(array[i]+'<br/>');
   //       }
   //       document.write('<br/>');
   //   }]

   // TODO: Fix logic with new RegEx reader
   var i = 0;
   for(; i < numbers.length; i++){
      switch(numbers.length > 0){
         case /.+/.test(numbers[i]):
            // Range of numbers
            break;
         case /,+/.test(numbers[i]):
            // Specific numbers
            break;
         default:
            util.log('WARNING: Unknown character when parsing equation');
      }
   }
};


