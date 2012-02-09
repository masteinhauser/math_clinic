if((!navigator.userAgent.match(/iPhone/i)) || (!navigator.userAgent.match(/iPad/i))) {
   $.extend( $.mobile, {
      defaultPageTransition: "none",
      defaultDialogTransition: "none"
   });
}

var Clinic = {
   Test: {
      Take: {},
      Create: {}
   }
};

Clinic.Test.Take = function(page, form){
   if(!form){
      form = $(page).find('form');
   }

   var start, finish, data;

   var methods = {
      url: "test/take",
      init: function(e){
         start = form.find('input[name=start]');
         finish = form.find('input[name=finish]');
         start.val(new Date().valueOf());
      },
      submit: function(e){
         finish.val(new Date().valueOf());
         data = form.serializeArray();

         //TODO:
         //Post form data to server
         //move on to next question
         //Timeout after 30 seconds, retry on next question submit

         e.preventDefault();
         e.stopPropagation();
      }
   };

   // Set up bindings
   page.live('pageshow', methods.init);
   form.live('submit', methods.submit);
   form.find('button').live('click', methods.submit);

   return methods;
};

$('div:jqmData(role="page")').live('pagebeforeshow',function(){
   Clinic.Test.Take = Clinic.Test.Take($('div#test-take'), $('div#test-take form'));
});
