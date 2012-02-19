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
         var css, table;

         answers.empty();
         $.each(json.test, function(iterator, test){
            var calc = json.calc[iterator];
            timestamp = new Date(test.ts).toLocaleDateString();
            timestamp += ' '+new Date(test.ts).toLocaleTimeString();
            div = $(answers.append('<div data-role="collapsible"></div>').find('div')[iterator]);
            div.append('<h3>'+json.user.name+'<br>'+timestamp+'</h3>');
            table = div.append('<table class="view"></table>');
            latency = [];
            table.append('<tr><th>User</th><th>Name</th><th colspan="2">Test Timestamp</th><th><button class="download">Download CSV</button><a class="output"></a></th></tr>');
            table.append('<tr><td>'+json.user.username+'</td><td>'+json.user.name+'</td><td colspan="2">'+timestamp+'</td></tr>');
            table.append('<tr style="display: none;"></tr>');
            table.append('<tr><th>Equation</th><th>Answer</th><th>latency</th><th>Correct</th></tr>');
            $.each(test.answers, function(iterator, answer){
               latency.push([iterator, answer.latency]);
               if(answer.correct){ css='black'; } else { css='red'; }
               table.append('<tr class="'+css+'"><td>'+answer.question+'</td><td>'+answer.answer+'</td><td>'+answer.latency+'</td><td>'+answer.correct+'</td></tr>');
            });
            table.append('<tr></tr>');
            table.append('<tr><th>Totals:</th></tr>');
            table.append('<tr><td>Correct:</td><td>'+calc.numCorrect+'</td></tr>');
            table.append('<tr><td>Digits Per Minute:</td><td>'+calc.digitsPerMinute+'</td></tr>');
            table.append('<tr><td>Average Latency:</td><td>'+calc.avgLatency+'</td></tr>');
            table.append('<tr><td>Total Latency:</td><td>'+calc.totalLatency+'</td></tr>');
            answers.append('<br>');
            //Clinic.Test.View.User.graph(test.answers, latency);
         });
         $(answers).trigger('create');
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
      },
      download: function(e){
         var el = $(this);
         var link = el.siblings('a.output');
         console.log('Downloading Test...');
//         Clinic.Util.downloadCSV(el.closest('table'), null);
         link.val(Clinic.Util.downloadCSV(el.closest('table'), null, link));

         el.trigger('refresh');
      }
   };

   // Bind to events
   $('.download').live('click', methods.download);

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
