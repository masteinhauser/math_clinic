/*
 * GET Equation Engine page.
 */

module.exports = function(app){
   app.get('/engine', function(req, res){
      res.render('engine.jade', {
         layout: false,
         title: 'Math Clinic - Equation Engine'
      });
   });

   app.post('/engine', function(req, res){
      var eq = require('../utils/EquationEngine');
      var randomize = req.body.randomize === "on"? true : false;
      var result = eq.run(req.body.eq, req.body.count, randomize);

      res.render('engine.jade', {
         layout: false,
         req: req.body,
         title: 'Math Clinic - Equation Engine',
         submit: req.body.submit,
         result: result
      });
   });
};

