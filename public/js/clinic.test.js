if((!navigator.userAgent.match(/iPhone/i)) || (!navigator.userAgent.match(/iPad/i))) {
   $.extend( $.mobile, {
      defaultPageTransition: "none",
      defaultDialogTransition: "none"
   });
}

// Define necessary namespaces
(function($){
   if(!window.Clinic){ window.Clinic = {}; }
   if(!Clinic.Test){ Clinic.Test = {}; }
   if(!Clinic.Test.Take){ Clinic.Test.Take = {}; }
   if(!Clinic.Test.Create){ Clinic.Test.Create = {}; }
})(jQuery);

Clinic.Test.Take = function(page, form){
   if(!form){
      form = $(page).find('form');
   }

   // Array of Question objects to use for testing the student.
   var Questions = [];
   // All of the answers the user has submitted while waiting for the server to accept.
   var Answers = [];
   var start, finish, data;
   var question, answer;
   var button;

   var methods = {
      init: 1,
      url: "test/take",
      index: 0,
      start: function(e){
         //TODO: Retrieve questions for this test from the server
         Questions.push({question: "15+2", level: 1});
         Questions.push({question: "10+2", level: 1});

         form.find('input[name="answer"]').val("");
         page.find('input[name="question"]').val(Questions[this.index].question);
         page.find('span.question').html(Clinic.Util.formatQuestion(Questions[this.index].question, false));
         start = new Date().valueOf();
      },
      submit: function(e){
         data = Clinic.Util.serializeForm(form);

         if(data.answer === ''){
            alert("You must answer the question!");
            e.preventDefault();
            e.stopPropagation();
         }

         finish = new Date().valueOf();

         response = form.find('#answer');
         if(data.answer != eval(data.question)){
            $(response).animateHighlight('#ff0000', 1000);
         }else{
            $(response).animateHighlight('#00ff00', 1000);
         }
         //TODO: Change the page to follow question logic:
         // Correct:   Display/change page, Load question info
         // Incorrect: change page into error logic
         // Clinic.util.changePage();

         Answers.push({
            question: data.question,
            latency: (finish - start)
         });

         //TODO:
         //Post form data to server
         //Timeout after 30 seconds, retry on next question submit
         $.ajax({
            url: this.url,
            data: data,
            timeout: 30000,
            success: function(){
               Answers = []; // Clear submitted answers(stupid method)
            },
            error: function(){
               //TODO: Display error icon
            }
         });

         e.preventDefault();
         e.stopPropagation();
      }
   };

   // Set up bindings
   form.live('submit', methods.submit);
   form.find('button').live('click', methods.submit);

   return methods;
};

// Initilize objects and bind to pages/forms/etc.
$('div#test-take').live('pageshow',function(){
   if(!Clinic.Util.numpad.init){ Clinic.Util.numpad = Clinic.Util.numpad($('#numpad'), $('#answer')); }
   if(!Clinic.Test.Take.init){ Clinic.Test.Take = Clinic.Test.Take($('div#test-take'), $('div#test-take form')); }
   Clinic.Test.Take.start();
});
$('div#test-create').live('pageshow',function(){
//   if(!Clinic.Test.Create.init){ Clinic.Test.Create = Clinic.Test.Create($('div#test-create'), $('div#test-create form')); }
});
