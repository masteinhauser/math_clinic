/*
 * GET Equation Engine page.
 */

module.exports = function(app){
   app.get('/engine', function(req, res){
      res.render('engine.jade', { title: 'Math Clinic - Equation Engine' });
   });
};

