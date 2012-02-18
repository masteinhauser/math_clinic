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

Clinic.Util.formatQuestion = function(question, linebreak){
   var spaces = function(str, num){ return Array(num + 1).join(str); };
   var qParts = question.replace(/([\+\-\*\/])/ig, "\\$1").split(/\\/);
   var maxCharsArray = qParts.slice(0); // Make a copy of the array so when we sort it, it doesn't mess up the equation.
   var maxChars = maxCharsArray.sort(function(a, b){ return b.length - a.length; })[0].length;
   function padParts(){
      var i;
      for(i=0; i<qParts.length; i++){
         qParts[i] = spaces("&nbsp;&nbsp;", maxChars-qParts[i].length) + qParts[i];
      }
   }

   padParts();
   question = qParts.join('</br>');
   question += "<br/>" + spaces("&#150;", maxChars);
   return question;
};

// Iterates over an array of tables, extracting data to build a CSV file which it then opens as a download
// Source found and modified from Flotr2: downloadCSV()
Clinic.Util.downloadCSV = function(tables, options, link){
   // Download vars
   window.URL = window.webkitURL || window.URL;
   window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
   var prevLink, a = document.createElement('a');
   if(link){
      prevLink = link.attr('href');
   }
   if(prevLink){
      window.URL.revokeObjectURL(prevLink.href);
      link.innerHTML = '';
   }

   var bb = new BlobBuilder();

   // CSV generation specific vars
   var MIME_TYPE = 'text/csv';
   var csv = '', i, j, row, col,
       newline = '\r\n'; // \r\n'

   // Set default options:
   if(!options){ options = {}; }
//   options.separator = encodeURIComponent(options.separator || ',');
//   options.decimalSeparator = encodeURIComponent(options.decimalSeparator || '.');
   options.separator = options.separator || ',';
   options.decimalSeparator = options.decimalSeparator || '.';

   if (options.decimalSeparator === options.csvFileSeparator) {
      throw "The decimal separator is the same as the column separator ("+options.decimalSeparator+")";
   }

   // Iterate the given table, extracting data
   $.each(tables, function(iterator, table){
      for(i=0, row; row = table.rows[i]; i++) {
         for(j=0, col; col = row.cells[j]; j++) {
            csv += '"'+col.innerText+'"' + options.separator;
            bb.append('"'+col.innerText+'"' + options.separator);
         }
         csv += newline;
         bb.append(newline);
      }
   });

   if(link){
      a.download = "Test.csv";
      a.href = window.URL.createObjectURL(bb.getBlob(MIME_TYPE));
      a.textContent = 'Download Ready';
      $.data(a, 'downloadurl', [MIME_TYPE, link.download, link.href].join(':'));
      link.html(a);
   }else{
      // Trigger the browser to download the file
      if ($.browser.msie && $.browser.version.substr(0,1)<9) {
         csv = csv.replace(new RegExp(separator, 'g'), decodeURIComponent(separator)).replace(/%0A/g, '\n').replace(/%0D/g, '\r');
         window.open().document.write(csv);
      }else{
         window.open('data:'+MIME_TYPE+','+csv);
      }
   }
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
