if((!navigator.userAgent.match(/iPhone/i)) || (!navigator.userAgent.match(/iPad/i))) {
   $.extend( $.mobile, {
      defaultPageTransition: "none",
      defaultDialogTransition: "none"
   });
}

// Define necessary namespaces
(function($){
   if(!window.Clinic){ window.Clinic = {}; }
   if(!Clinic.Data){ Clinic.Data = {}; }
   if(!Clinic.Test){ Clinic.Test = {}; }
   if(!Clinic.Test.Take){ Clinic.Test.Take = {}; }
   if(!Clinic.Test.Create){ Clinic.Test.Create = {}; }
})(jQuery);

Clinic.Test.Take = function(page, form){
   if(!form){
      form = $(page).find('form');
   }

   // Array of Question objects to use for testing the student.
   var Questions = Clinic.Data.Questions = [];
   // All of the answers the user has submitted while waiting for the server to accept.
   var Answers = Clinic.Data.Answers = [];
   var start, finish, data;
   var question, answer;
   var button;

   var methods = {
      init: 1,
      load: function(callback){
         //console.log("Loading Data...");
         //TODO: Retrieve questions for this test from the server
         $.getJSON("questions/0", function(json){
            // Iterates over each PIECE of data in the returned JSON.
            $.each(json.questions, function(key, value){
               Questions.push({question: value});
            });
            if(callback){ callback(); }
         });
      },
      url: "test/take",
      index: 0,
      start: function(e){
         //console.log("Starting Question...");
         form.find('input[name="answer"]').val("");
         form.find('input[name="question"]').val(Questions[methods.index].question);
         page.find('span.question').html(Clinic.Util.formatQuestion(Questions[methods.index].question, false));
         start = new Date().valueOf();
      },
      submit: function(e){
         var correct;
         //console.log("Saving Question...");
         //console.log("Index: "+methods.index);
         data = Clinic.Util.serializeForm(form);

         if(data.answer === ''){
            alert("You must answer the question!");
            e.preventDefault();
            e.stopPropagation();
            return false;
         }

         finish = new Date().valueOf();

         //TODO: Change the page to follow question logic:
         // Correct:   Display/change page, Load question info
         // Incorrect: change page into error logic
         response = form.find('#answer');
         if(data.answer != eval(data.question)){
            $(response).animateHighlight('#ff0000', 1000);
            correct = false;
         }else{
            correct = true;
            methods.index++;
            if(methods.index < Questions.length){
               $(response).animateHighlight('#00ff00', 1000, function(){
                  methods.start();
               });
            }else{
               $(response).animateHighlight('#00ff00', 1000, function(){
                  Clinic.Util.changePage('#test-complete');
               });
            }
         }

         Answers.push({
            question: data.question,
            answer: data.answer,
            latency: (finish - start),
            correct: correct
         });

         //TODO:
         //Post form data to server
         //Timeout after 30 seconds, retry post on next question submit
/*         $.ajax({
            url: this.url,
            data: data,
            timeout: 30000,
            success: function(){
               Answers = []; // Clear submitted answers(stupid method)
            },
            error: function(){
               //TODO: Display error icon
            }
         });*/

         e.preventDefault();
         e.stopPropagation();
      }
   };

   // Set up bindings
   page.live('pageshow', Clinic.Test.Take.start);
   form.live('submit', methods.submit);
   form.find('button').live('click', methods.submit);

   return methods;
};

Clinic.Test.Complete = function(page){
   var i, table, divAnswers = $(page.find('div.answers'));

   var methods = {
      init: 1,
      load: function(e){
         var Answers = Clinic.Data.Answers, answer;
         var Questions = Clinic.Data.Questions;
         var totalLatency = 0, totalCorrect = 0;

         if(Answers){
            table = divAnswers.html('<table></table>').find('table');
            table.append('<tr><th>Question</th><th>Answer</th><th>Latency(ms)</th></tr>');
            for(i = Answers.length-1; i>=0; i--){
               answer = Answers[i];
               totalLatency += answer.latency;
               if(answer.correct){ totalCorrect++; }
               table.append('<tr><td>'+answer.question+'</td><td>'+answer.answer+'</td><td>'+answer.latency+'</td></tr>');
            }
            divAnswers.append('<p>Totals:<br/><strong>Questions: '+Questions.length+'<br/>Answers: '+Answers.length+'<br/>Total Correct: '+totalCorrect+'<br/>Total Latency: '+totalLatency+'<br/>Average Latency: '+(totalLatency/Answers.length)+'</strong></p>');
         }else{
            divAnswers.html('<h3>No Data Available</h3>');
            divAnswers.append('<a href="#take-test">Take Test</a>');
         }
      }
   };

   return methods;
};

Clinic.Test.Create = function(page, form){
};

// Initilize objects and bind to pages/forms/etc.
$('div#test-take').live('pageshow',function(){
   var page = $('div#test-take');
   var form = $('div#test-take form');

   if(!Clinic.Util.numpad.init){ Clinic.Util.numpad = Clinic.Util.numpad($('#numpad'), $('#answer')); }
   if(!Clinic.Test.Take.init){
      Clinic.Test.Take = Clinic.Test.Take(page, form);
      Clinic.Test.Take.load(Clinic.Test.Take.start);
   }else{
      Clinic.Test.Take.start();
   }
});

$('div#test-complete').live('pageshow',function(){
   var page = $('div#test-complete');

   if(!Clinic.Test.Complete.init){ Clinic.Test.Complete = Clinic.Test.Complete(page); }
   Clinic.Test.Complete.load();
});

$('div#test-create').live('pageshow',function(){
//   if(!Clinic.Test.Create.init){ Clinic.Test.Create = Clinic.Test.Create($('div#test-create'), $('div#test-create form')); }
});
