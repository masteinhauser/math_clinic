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
            table.append('<tr><td>'+user.role+'</td><td>'+user.username+'</td><td>'+user.fname+'</td><td>'+user.lname+'</td><td>'+new Date(user.birth).toLocaleDateString()+'</td><td><button class="edit" value="'+user._id+'">Edit</button></td><td><button class="del" value="'+user._id+'">Delete</button></td><td><button class="tests" value="'+user._id+'">Tests</button></td></tr>');
         });
         if(callback){ callback(); }
         page.trigger('create');
      },
      edit: function(){
         var id = this.value;
         Clinic.Util.changePage("user/edit/"+id);
      },
      del: function(){
         var id = this.value;
         var username;
         $.each(Clinic.Data.Users, function(iterator, user){
            if(user._id === id){
               username = user.username;
            }
         });
         $.post("user/del/"+id, function(data){
            if(data.err === "" || data.err === null){
               alert("User: "+username+" has been deleted.");
            }else{
               alert("Error while deleting "+username+".\nThe error was: "+data.err);
            }
            methods.load(methods.display);
         });
      },
      tests: function(){
         var id = this.value;
         var page = $('div#test-view-user');

         if(!Clinic.Test.View.User.init){ Clinic.Test.View.User = Clinic.Test.View.User(page); }
         Clinic.Test.View.User.load('user', id, function(json){
            Clinic.Test.View.User.display(json);
         });

         Clinic.Test.View.User.loaded = 1;
         Clinic.Util.changePage("#test-view-user");
      }
   };

   // Bind events
   page.find('button.edit').live('click', methods.edit);
   page.find('button.del').live('click', methods.del);
   page.find('button.tests').live('click', methods.tests);

   return methods;
};

// Initilize objects and bind to pages/forms/etc.
$('div#users').live('pageshow',function(){
   var page = $('div#users');

   if(!Clinic.Users.init){ Clinic.Users = Clinic.Users(page); }
   Clinic.Users.load(Clinic.Users.display);
});
