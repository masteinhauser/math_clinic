/*
 * Test page.
 */

module.exports = function(app){
   var layout = 'page.jade';

   app.get('/test/take', auth.ensAuth, function(req, res){
      var results = 
      res.json(results);
   });

   app.post('/test/take', auth.ensAuth, function(req, res){
      
   });

   app.get('/test/create', auth.ensAuth, function(req, res){
      res.render('test-create.jade', {
         req: req,
         layout: layout,
         title: 'Math Clinic - Create Test'
      });
   });

   app.post('/test/create', auth.ensAuth, function(req, res){
      var eq = require('../utils/EquationEngine');
      var result = eq.run(req.body.eq, 20, true);

      res.render('test-create.jade', {
         req: req.body,
         layout: layout,
         title: 'Math Clinic - Create Test',
         result: result
      });
   });
};

