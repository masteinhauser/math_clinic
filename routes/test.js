/*
 * Test page and API.
 */
module.exports = function(app){

   // Capture the POSTed answer data and record it in the user's test
   app.post('/test/take/', auth.ensAuth, function(req, res){
      //TODO: Write code to take the posted questions and insert them into the user's current test based on the test ID they send
   });

   app.post('/test/create/:eq/:type/:level', auth.ensAuth, function(req, res){
      Question.add(req.params.type, req.params.level, req.params.eq, function(err){
         var response;
         if(err){
            response = {success: false, err: err};
         }

         var question = Question.findByEquation(req.params.eq, function(err, question){
            response = {success: true, err: err, question: question};
            res.json(response);
         });
      });
   });

};

