window.Clinic = {
   // namespaces
   Router: {},
   Model: {},
   Collection: {},
   View: {},

   // Code which must run when app first loaded
   initialize: function(){
      var col = new Clinic.Collection.Questions([
         {problem: "2+1", answer: 3},
         {problem: "2+2", answer: 4},
         {problem: "2+3", answer: 5}
      ]);
      var view = new Clinic.View.QuestionSet({collection: col});
      $('').html(view.render().el);
   }
};

// Routers/Controllers
Clinic.router = new $.mobile.Router([
   { "#home": { events: "i", handler: "Clinic.Model.home" } },
   { "/restaurant.html[?]id=(\\d+)": { events: "i", handler: "restaurantDetail" } },
   { "/events.html(?:[?](.*))?": { events: "i", handler: "events" } },
   { "/eventDetail.html(?:[?](.*))?": { events: "i", handler: "eventDetail" } },
   { "/accomodations.html(?:[?](.*))?": { events: "i", handler: "accomodationsTaxonomy" } },
   { "/accomodationList.html(?:[?](.*))?": { events: "i", handler: "accomodations" } }
], ControllerObject, { ajaxApp: true} );

// Router/Controller Logic
Clinic.getTest = function(){
   // TODO: Logic to get tests
};

// Models
Clinic.Test = new Backbone.Model.extend({
   defaults: {
      //TODO: Any default properties necessary
   },
   initialize: function(){
      //TODO: any startup stuff necessary
   }
});

Clinic.Question = new Backbone.Model.extend({

});

// Collections
Clinic.Questions = new Backbone.Collection.extend({
   model: Question
});

