Clinic.Util.numpad = function(numpad, write){
	var $write = $(write),
		shift = false,
		capslock = false;
	
	var methods = {
      init: 1,
      keyHit: function(){
         var $this = $(this),
            character = $this.html(); // If it's a lowercase letter, nothing happens to this variable

         // Shift keys
         if ($this.hasClass('left-shift') || $this.hasClass('right-shift')) {
            $('.letter').toggleClass('uppercase');
            $('.symbol span').toggle();

            shift = (shift === true) ? false : true;
            capslock = false;
            return false;
         }

         // Caps lock
         if ($this.hasClass('capslock')) {
            $('.letter').toggleClass('uppercase');
            capslock = true;
            return false;
         }

         // Delete
         if ($this.hasClass('delete')) {
            var val = $write.val();

            $write.val(val.substr(0, val.length - 1));
            return false;
         }

         // Special characters
         if ($this.hasClass('symbol')){ character = $('span:visible', $this).html(); }
         if ($this.hasClass('space')){ character = ' '; }
         if ($this.hasClass('tab')){ character = "\t"; }
         if ($this.hasClass('return')){ character = "\n"; }

         // Uppercase letter
         if ($this.hasClass('uppercase')){ character = character.toUpperCase(); }

         // Remove shift once a key is clicked.
         if (shift === true) {
            $('.symbol span').toggle();
            if (capslock === false){ $('.letter').toggleClass('uppercase'); }

            shift = false;
         }

         // Add the character
         $write.val($write.val() + character);
      }
   };

   //Bind events
   $(numpad).find('li').click(methods.keyHit);

   return methods;
};
