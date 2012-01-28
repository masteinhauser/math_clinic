var getAge = exports.getAge = function(birth){
   // Found on Stack Overflow: http://stackoverflow.com/a/7091965/606600
   var today = new Date();
   var birthDate = new Date(birth);
   var age = today.getFullYear() - birthDate.getFullYear();
   var m = today.getMonth() - birthDate.getMonth();
   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
   }

   return age;
};
