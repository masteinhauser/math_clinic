if((!navigator.userAgent.match(/iPhone/i)) || (!navigator.userAgent.match(/iPad/i))) {
   $.extend( $.mobile, {
      defaultPageTransition: "none",
      defaultDialogTransition: "none"
   });
}

// Define necessary namespaces
(function($){
   if(!window.Clinic){ window.Clinic = {}; }
   if(!Clinic.Questions){ Clinic.Questions = {}; }
   if(!Clinic.Data){ Clinic.Data = {}; }
})(jQuery);

Clinic.Questions = function(page){

   // Array of Question objects available for testing the student.
   var Questions = Clinic.Questions.questions = [];

   var methods = {
      init: 1,
      url: "questions",
      load: function(callback){
         //console.log("Loading Data...");
         $.getJSON(methods.url, function(json){
            Clinic.Data.AvailableQuestions = json.questions;
            if(callback){ callback(); }
         });
      },
      display: function(callback){
         var tbQuestions = page.find('table.questions');

         tbQuestions.empty();
         tbQuestions.append('<th>Equation</th><th>Type</th><th>Level</th>');
         $.each(Clinic.Data.AvailableQuestions, function(iterator, question){
            tbQuestions.append('<tr><td>'+question.equation+'</td><td>'+question.type+'</td><td>'+question.level+'</td></tr>');
         });
         if(callback){ callback(); }
      }
   };

   return methods;
};

// Initilize objects and bind to pages/forms/etc.
$('div#questions').live('pageshow',function(){
   var page = $('div#questions');

   if(!Clinic.Questions.init){ Clinic.Questions = Clinic.Questions(page); }
   Clinic.Questions.load(Clinic.Questions.display);
});
