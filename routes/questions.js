/*
 * GET Equation Engine page.
 */

module.exports = function(app){
   app.get('/questions/:id', auth.ensAuth, function(req, res){
      var Questions = [];
      //TODO: Lookup user and test by Id
      //grab equation and generate questions or something.
      var eq = require('../utils/EquationEngine');
      Questions = eq.run("[10..19][+][0..9]", 100, true);

      res.json(Questions);
   });

   app.post('/questions', auth.ensAuth, function(req, res){
      var eq = require('../utils/EquationEngine');
      var result = eq.run(req.body.eq, req.body.count);

      res.render('engine.jade', {
         layout: false,
         req: req.body,
         title: 'Math Clinic - Equation Engine',
         submit: req.body.submit,
         result: result
      });
   });
};

