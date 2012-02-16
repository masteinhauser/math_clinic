if((!navigator.userAgent.match(/iPhone/i)) || (!navigator.userAgent.match(/iPad/i))) {
   $.extend( $.mobile, {
      defaultPageTransition: "none",
      defaultDialogTransition: "none"
   });
}

// Define necessary namespaces
(function($){
   if(!window.Clinic){ window.Clinic = {}; }
   if(!Clinic.Users){ Clinic.Users = {}; }
   if(!Clinic.Data){ Clinic.Data = {}; }
})(jQuery);

Clinic.Users = function(page){

   // Array of Question objects available for testing the student.
   var Users = Clinic.Users.users = [];

   var methods = {
      init: 1,
      url: "users",
      load: function(callback){
         //console.log("Loading Users...");
         $.getJSON(methods.url, function(json){
            Clinic.Data.Users = json.users;
            if(callback){ callback(); }
         });
      },
      display: function(callback){
         var table = page.find('table.users');

         table.empty();
         table.append('<th>Role</th><th>Username</th><th>First Name</th><th>Last Name</th><th>Birth Date</th>');
         $.each(Clinic.Data.Users, function(iterator, user){
            table.append('<tr><td>'+user.role+'</td><td>'+user.username+'</td><td>'+user.fname+'</td><td>'+user.lname+'</td><td>'+new Date(user.birth).toLocaleDateString()+'</td></tr>');
         });
         if(callback){ callback(); }
      }
   };

   return methods;
};

// Initilize objects and bind to pages/forms/etc.
$('div#users').live('pageshow',function(){
   var page = $('div#users');

   if(!Clinic.Users.init){ Clinic.Users = Clinic.Users(page); }
   Clinic.Users.load(Clinic.Users.display);
});
