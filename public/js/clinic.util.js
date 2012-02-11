// Define global namespace and/or merge with existing.
(function($){
   if(!window.Clinic){ window.Clinic = {}; }
   if(!Clinic.Util){ Clinic.Util = {}; }
})(jQuery);

Clinic.Util.serializeForm = function(form){
   var i, obj = {};
   var arr = $(form).serializeArray();

   // Loop over the elements of the array.
   // If there are multiple with same name it creates array of them.
   for(i=0; i<arr.length; i++){
      obj[arr[i].name] = arr[i].value;
   }
   return obj;
};

Clinic.Util.changePage = function(page, options){
   if(!options){ options = {}; }
   options.transition = options.transition || "slide";
   options.changeHash = options.changeHash || "false";
   options.allowSamePageTransition = options.allowSamePageTransition || "false";

   // Change page using args we set.
   $.mobile.changePage(page, options);
};

Clinic.Util.openDialog = function(message, title){
    title = title || (title = "Notification");
    message = message || (message = "Error");
    var dialog = $('#dialog');

    // Set the content of the header.
    dialog.find('.header').find('.title').html(title);

    // Set the content of the dialog.
    dialog.find('.content').html(message);

    // Open Dialog
    $.mobile.changePage('#dialog', {
        transition: "pop", 
        changeHash: "false",
        role: "dialog"
    });
};

Clinic.Util.updateListView = function(listview){
    if(listview.hasClass('ui-listview')){
        listview.listview("refresh");
    } else {
        listview.trigger("create");
    }
    listview.find("li:first").addClass("ui-corner-top");
    listview.find("li:last").addClass("ui-corner-bottom");
};

Clinic.Util.formatQuestion= function(question, linebreak){
   var spaces = function(str, num){ return Array(num + 1).join(str); };
   var qParts = question.replace(/([\+\-\*\/])/ig, "\\$1").split(/\\/);
   var maxChars = qParts.sort(function(a, b){ return b.length - a.length; })[0].length;

   question = qParts.join('</br>');
   question += "<br/>" + spaces("&#150;", maxChars);
   return question;
};

$.fn.animateHighlight = function(highlightColor, duration, callback) {
   var highlightBg = highlightColor || "#FFFF9C";
   var animateMs = duration || 1000;
   var originalBg = this.css("backgroundColor");
   this.stop().css("background-color", highlightBg).animate(
      {backgroundColor: originalBg},
      {
         duration: animateMs,
         complete: function(){
            this.style.removeProperty('background-color');
            if(callback){ callback(); }
         }
      }
   );
};
