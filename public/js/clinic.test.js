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
   var Questions = [{
      question: ""
   }];
   // All of the answers the user has submitted while waiting for the server to accept.
   var Answers = [{
      question: "",
      tries: "",
      latency: ""
   }];
   var start, finish, data;
   var question, answer;
   var button;

   var methods = {
      init: 1,
      url: "test/take",
      start: function(e){
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
         //TODO: Add data to Answer, change page
         // Clinic.util.changePage();

         button = form.find('button');
         if(data.answer != eval(data.question)){
            console.log("Incorrect!");
            $(button).animateHighlight('#ff0000', 1000);
         }else{
            console.log("Correct!");
            $(button).animateHighlight('#00ff00', 1000);
         }

         Answers.push(data);

         //TODO:
         //Post form data to server
         //move on to next question
         //Timeout after 30 seconds, retry on next question submit
         $.ajax({
            url: this.url,
            data: data,
            timeout: 30000,
            success: function(){
               Answers = []; // Clear submitted answers(stupid method)
            },
            error: function(){
            }
         });

         e.preventDefault();
         e.stopPropagation();
      }
   };

   // Set up bindings
   page.live('pageshow', methods.start);
   form.live('submit', methods.submit);
   form.find('button').live('click', methods.submit);

   return methods;
};

// Initilize objects and bind to pages/forms/etc.
$('div#test-take').live('pagebeforeshow',function(){
   if(!Clinic.Test.Take.init){ Clinic.Test.Take = Clinic.Test.Take($('div#test-take'), $('div#test-take form')); }
});
$('div#test-create').live('pagebeforeshow',function(){
//   if(!Clinic.Test.Create.init){ Clinic.Test.Create = Clinic.Test.Create($('div#test-create'), $('div#test-create form')); }
});
