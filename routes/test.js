/*
 * Test page.
 */
var auth = require('../utils/Auth');

module.exports = function(app){
   app.get('/test', auth.ensAuth, function(req, res){
      res.render('test.jade', { title: 'Math Clinic - Test' });
   });

   app.post('/test', auth.ensAuth, function(req, res){
      var result = { 
         correct: true,
         time: new Date().valueOf() - req.body.start
      };

      res.render('test.jade', { req: req.body, title: 'Math Clinic - Test', result: result });
   });
};

