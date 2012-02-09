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
Clinic.APPLICATION_URL = window.location.pathname.split('/')[1];

Clinic.Test.Take = function(page, form){
   console.log("Clinic.Test.Take: initialized");
   var start, finish;

   var methods = {
      init: function(e){
        console.log(e.type+" detected: ");
        start = $('input[name=start]');
        finish = $('input[name=finish]');
        start.val(new Date().valueOf());
      },
      submit: function(e){
         console.log(e.type+" detected: ");
         var url = "#{basepath}"+"/test/take";
         var data = form.serialize();
        finish.val(new Date().valueOf());

        //TODO: Post form data to server, receive response, move on to next question
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

Clinic.Test.Take = new Clinic.Test.Take($('div#test_take'), $('div#test_take form'));
