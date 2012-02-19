exports.round = function(n,dec) {
   n = parseFloat(n);
   if(!isNaN(n)){
      if(!dec){
         dec= 0;
      }
      var factor= Math.pow(10,dec);
      return Math.floor(n*factor+((n*factor*10)%10>=5?1:0))/factor;
   }else{
      return n;
   }
};
