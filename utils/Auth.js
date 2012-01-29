exports.ensAuth = function(req, res, next){
   if(req.isAuthenticated()){ return next(); }
      res.redirect(config.path+'/login');
};

