// Gameplay assignment 1, 10/6/2012, Michael Micheletti

// Global app object
var app = app || { };

// Loader property of the app object, used to initialize scripts
app.loader = app.loader || { };

// When invoked, will load required scripts and perform app startup
app.loader.run = function () {
  'use strict';
  
  // Modernizr loads scripts and starts the app afterwards
  Modernizr.load({  
    load: ['../../scripts/jquery-1.8.2.min.js', 'app.js'],  
    complete: function () {
      app.start();
    }
  });
};

// Run the app's loader, app will be ready to roll afterwards
app.loader.run();