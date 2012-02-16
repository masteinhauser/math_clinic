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
      index: 0,
      timeout: null,
      timeoutInterval: 5000, // 5 seconds
      url: "test/take",
      processing: 0, // Used internally to make sure a problem is only submitted once.
      choose: function(callback){
         // Function to be called if we have or do not have Questions loaded.
         function displayChoices(){
            var choiceForm = page.find('form.equation');
            var equation = choiceForm.find('select#eq');
            var count = choiceForm.find('input#count');
            var options = [];

            //console.log(Clinic.Data.AvailableQuestions);
            // 1. List choices
            $.each(Clinic.Data.AvailableQuestions, function(key, value){
               options.push('<option value="'+key+'">'+value.equation+'</option>');
            });
            equation.append(options.join('')).selectmenu('refresh', true);

            // 2. capture selection
            choiceForm.find('button').live('click', function(){
               choiceForm.hide();
               var testId = equation.val();
               var num = count.val();
               // 3. callback to methods.load() to load questions from server
               callback(testId, num);
            });
         }

         // Load possible Questions from server
         if(typeof Clinic.Data.AvailableQuestions === 'undefined' || Clinic.Data.AvailableQuestions.length === 0){
            //TODO: Move this load function into utils or somewhere
            Clinic.Questions = Clinic.Questions(null); // We need an object, even if we're not on that page.
            Clinic.Questions.load(displayChoices);
         }else{
            displayChoices();
         }
      },
      load: function(index, num, callback){
//         console.log("Loading Data...\n"+testId);
         var eq = Clinic.Data.AvailableQuestions[index].equation;
         //TODO: Retrieve questions for this test from the server
         $.getJSON("questions/"+eq+'/'+num, function(json){
            // Iterates over each PIECE of data in the returned JSON.
            $.each(json.questions, function(key, value){
               Questions.push({question: value});
            });
            if(callback){ callback(); }
         });
      },
      start: function(event, timeout){
         //console.log("Starting Question...");
         form.find('input[name="answer"]').removeAttr("readonly").val("");
         form.find('input[name="question"]').val(Questions[methods.index].question);
         page.find('span.question').html(Clinic.Util.formatQuestion(Questions[methods.index].question, false));
         start = new Date().valueOf();
         methods.processing = 0;
         if(timeout){ clearTimeout(methods.timeout); methods.timeout = setTimeout(function(){ methods.error(5000); }, timeout); }
      },
      error: function(timeout){
         //console.log("Error Question...");
         // Allow normal question start, but with the same question
         methods.start();
         // Let everyone know we're processing something so submits are skipped.
         methods.processing = 1;
         // We want to forcefully display the question and answer
         form.find('input[name="answer"]').attr("readonly", "");
         form.find('input[name="answer"]').val(eval(Questions[methods.index].question));
         // Display for 5 seconds
         methods.timeout = setTimeout(function(){ methods.start(null, timeout); }, 4000);
      },
      submit: function(e){
         if(methods.processing) { return false; }
         clearTimeout(methods.timeout);

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

         response = form.find('#answer');
         if(data.answer != eval(data.question)){
            correct = false;
            $(response).animateHighlight('#ff0000', 1000, function(){
               methods.error(methods.timeoutInterval);
            });
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
            correct: correct,
            submitted: false
         });

         // Convert the Answers object with the new answer for submission
         var submitAnswers = [];
         var submitAnswersPositions = [];
         for(i=0; i<Answers.length; i++){
            if(!Answers[i].submitted){
               submitAnswers.push(Answers[i]);
               submitAnswersPositions.push(i);
            }
         }
         submitData = {data: JSON.stringify(submitAnswers)};

         //TODO:
         //Post form data to server
         //Timeout after 30 seconds, retry post on next question submit
         $.ajax({
            url: methods.url,
            type: 'POST',
            data: submitData,
            timeout: 30000,
            success: function(){
               var curAnswerPos;
               for(i=0; i<submitAnswersPositions.length; i++){
                  curAnswerPos = submitAnswersPositions[i];
                  Answers[curAnswerPos].submitted = true;
               } // Clear submitted answers
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

Clinic.Test.Complete = function(page){
   var i, table, css, totalsHTML;
   var divAnswers = $(page.find('div.answers')),
       divGraph = document.getElementById('graph');
   var graph, graphData = [];

   var methods = {
      init: 1,
      load: function(e){
         var Answers = Clinic.Data.Answers, answer;
         var Questions = Clinic.Data.Questions;
         var totalLatency = 0, totalCorrect = 0;

         if(Answers){
            table = divAnswers.html('<table></table>').find('table');
            table.append('<tr><th>Question</th><th>Answer</th><th>Latency(ms)</th></tr>');
            for(i = 0; i<Answers.length; i++){
               answer = Answers[i];
               graphData.push([i, answer.latency]);
               totalLatency += answer.latency;
               if(answer.correct){ css='black'; totalCorrect++; } else { css='red'; }
               table.append('<tr class='+css+'><td>'+(i+1)+". "+answer.question+'</td><td>'+answer.answer+'</td><td>'+answer.latency+'</td></tr>');
            }
            totalsHTML = ('<p>Totals:<br><strong>Questions Possible: '+Questions.length+'<br>Questions Asked: '+Clinic.Test.Take.index+'<br>Answers: '+Answers.length+'<br/>Total Correct: '+totalCorrect+'<br/>Total Latency: '+totalLatency+'<br>Average Latency: '+(totalLatency/Answers.length)+'</strong></p>');
            divAnswers.html(totalsHTML + divAnswers.html());

            graph = Flotr.draw(divGraph,
               [{
                  data: graphData,
                  lines: {show: true},
                  points: {show: true}
               }],
               {
                  xaxis: {
                     title: 'Question Asked',
                     min: 0,
                     max: Answers.length,
                     ticks: function(n){ var i, ticks = []; for(i=n.min; i<n.max; i++){ ticks.push([i, Answers[i].question]); } return ticks;}
                  },
                  yaxis: {
                     title: 'Time in Milliseconds'
                  },
                  title: 'Results of Test by Question',
                  HtmlText: false
               }
            );
         }else{
            divAnswers.html('<h3>No Data Available</h3>');
            divAnswers.append('<a href="#take-test">Take Test</a>');
         }
      }
   };

   return methods;
};

Clinic.Test.Create = function(page, form){
   var methods = {
      init: 1,
      create: function(e){
         //console.log("Start create");
         var url = "test/create/:eq/:type/:level";
         var eq = form.find('input[name="eq"]').val();
         var type = "addition";
         var level = "easy";

         $.ajax({
            url: url.replace(':eq', eq).replace(':type', type).replace(':level', level),
            type: 'POST',
            dataType: 'json',
            timeout: 30000,
            success: function(data){
               alert("Question added with equation: "+eq);
            },
            error: function(){
               //TODO: Display error message and icon
            }
         });

         e.preventDefault();
         e.stopPropagation();
      },
      generate: function(e){
         var i;
         var url = "questions/:eq/:count";
         var eq = form.find('input[name="eq"]').val();
         var count = 20;

         //console.log("Start generate");
         $.ajax({
            url: url.replace(':eq', eq).replace(':count', count),
            type: 'GET',
            dataType: 'json',
            timeout: 30000,
            success: function(data){
               //Print out questions formatted, etc.
               var preview = page.find('#preview');

               preview.find('#eq').text(data.equation);
               preview.find('#total').text(data.total);

               var tbQuestions = preview.find('table.questions tbody');
               tbQuestions.empty();
               var row = Math.ceil(Math.sqrt(data.questions.length));
               for(i=0; i<data.questions.length; i++){
                  if(i%row === 0){ tbQuestions.append('<tr>'); }
                  tbQuestions.append('<td>'+Clinic.Util.formatQuestion(data.questions[i])+'<br>'+eval(data.questions[i])+'</td>');
                  if(i%row === 0){ tbQuestions.append('</tr>'); }
               }
               preview.show();
            },
            error: function(){
               //TODO: Display error message and icon
            }
         });

         e.preventDefault();
         e.stopPropagation();
      }
   };

   // Set up bindings
   form.find('button[name="generate"]').live('click', methods.generate);
   form.find('button[name="create"]').live('click', methods.create);

   return methods;
};

// Initilize objects and bind to pages/forms/etc.
$('div#test-take').live('pageshow',function(){
   var page = $('div#test-take');
   var form = $('div#test-take form.question');

   if(!Clinic.Util.numpad.init){ Clinic.Util.numpad = Clinic.Util.numpad($('#numpad'), $('#answer')); }
   if(!Clinic.Test.Take.init){
      Clinic.Test.Take = Clinic.Test.Take(page, form);
   }
   if(typeof Clinic.Data.Questions != 'undefined' && Clinic.Data.Questions.length > 0){
      Clinic.Test.Take.choose(function(testId, num){
         Clinic.Test.Take.load(testId, num, Clinic.Test.Take.start);
      });
   }else{
      Clinic.Test.Take.choose(function(testId, num){
         Clinic.Test.Take.load(testId, num, Clinic.Test.Take.start);
      });
   }
});

$('div#test-complete').live('pageshow',function(){
   var page = $('div#test-complete');

   if(!Clinic.Test.Complete.init){ Clinic.Test.Complete = Clinic.Test.Complete(page); }
   Clinic.Test.Complete.load();
});

$('div#test-create').live('pageshow',function(){
   if(!Clinic.Test.Create.init){ Clinic.Test.Create = Clinic.Test.Create($('div#test-create'), $('div#test-create form#create')); }
});
