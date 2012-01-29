var bcrypt = require('bcrypt');

var salt = bcrypt.genSaltSync(10);
console.log('Salt: ' + salt);
var hash = bcrypt.hashSync('pass', salt);
console.log('Hash: ' + hash);

var userUtil = require('./utils/User');
userUtil.genPassword("pass", "pass", function(err, hash){
  console.log('Hash: '+hash);

  userUtil.validPassword("pass", hash, function(err, res){
    if(err){
       throw err;
    }
    console.log('Result: '+res);
  });
});
