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
   if(!Clinic.Test.View){ Clinic.Test.View = {}; }
   if(!Clinic.Test.View.User){ Clinic.Test.View.User = {}; }
   if(!Clinic.Test.View.Admin){ Clinic.Test.View.Admin = {}; }
})(jQuery);

Clinic.Test.View.User = function(page){

   var methods = {
      init: 1,
      url: "test/:type/:id",
      load: function(type, id, callback){
         console.log("Loading Data...\ntype: "+type+"\nid: "+id);
         $.getJSON(methods.url.replace(':type', type).replace(':id', id), function(json){
            if(callback){ callback(json); } else { return json; }
         });
      },
      display: function(json, callback){
         var answers = page.find('div.answers');
         var latency = [];

         answers.empty();
         var table = answers.append('<table></table>').find('table');
         $.each(json.test, function(iterator, test){
            latency = [];
            table.append('<th>User</th><th>Timestamp</th>');
            table.append('<tr><td>'+test.user+'</td><td>'+test.ts+'</td></tr>');
            table.append('<tr><th>Correct</th><th>latency</th><th>Equation</th><th>Answer</th></tr>');
            $.each(test.answers, function(iterator, answer){
               latency.push([iterator, answer.latency]);
               table.append('<tr><td>'+answer.correct+'</td><td>'+answer.latency+'</td><td>'+answer.question+'</td><td>'+answer.answer+'</td></tr>');
            });
            //Clinic.Test.View.User.graph(test.answers, latency);
         });
         if(callback){ callback(json); }
      },
      graph: function(answers, latency){
         var divGraph = document.getElementById('graph');

         graph = Flotr.draw(divGraph,
            [{
               data: latency,
               lines: {show: true},
               points: {show: true}
            }],
            {
               xaxis: {
                  title: 'Question Asked',
                  min: 0,
                  max: answers.length,
                  ticks: function(n){ var i, ticks = []; for(i=n.min; i<n.max; i++){ ticks.push([i, answers[i].question]); } return ticks;}
               },
               yaxis: {
                  title: 'Time in Milliseconds'
               },
               title: 'Results of Test by Question',
               HtmlText: false
            }
         );
      }
   };

   return methods;
};

// Initilize objects and bind to pages/forms/etc.
$('div#test-view-user').live('pageshow',function(){
   var page = $('div#test-view-user');

   if(!Clinic.Test.View.User.init){ Clinic.Test.View.User = Clinic.Test.View.User(page); }
   Clinic.Test.View.User.load('user', '', function(json){
      Clinic.Test.View.User.display(json);
   });
});

$('div#test-view-admin').live('pageshow',function(){
   var page = $('div#test-view-admin');

   if(!Clinic.Test.View.Admin.init){ Clinic.Test.View.Admin = Clinic.Test.View.Admin(page); }
});
