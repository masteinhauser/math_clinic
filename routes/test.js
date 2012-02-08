/*
 * Test page.
 */

module.exports = function(app){
   app.get('/test', auth.ensAuth, function(req, res){
      res.render('test.jade', { req: req, title: 'Math Clinic - Test' });
   });

   app.post('/test', auth.ensAuth, function(req, res){
      var result = { 
         correct: true,
         time: req.body.finish - req.body.start
      };

      res.render('test.jade', {
         layout: false,
         req: req.body,
         title: 'Math Clinic - Test',
         result: result
      });
   });
};

