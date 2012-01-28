/*
 * GET Equation Engine page.
 */

module.exports = function(app){
   app.get('/engine', function(req, res){
      res.render('engine.jade', { title: 'Math Clinic - Equation Engine' });
   });

   app.post('/engine', function(req, res){
      var eq = require('../utils/EquationEngine');
      var result = eq.run(req.body.eq, req.body.count);

      res.render('engine.jade', { title: 'Math Clinic - Equation Engine', submit: req.body.submit, result: result });
   });
};

