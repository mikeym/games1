// MikeyCell loader
// Michael Micheletti HTML5 Gameplay homework project

// Global game object
var mikeycell = mikeycell || { };

// Loader property of the global object, used to initialize scripts
mikeycell.loader = (function () {
  'use strict';
	var that = this;
  
  // Initializes if needed
  function run () {
    console.log('mikeycell.loader.run');

    var firstRun = true;
    if ( firstRun ) {
      init();
      firstRun = false;  
    }
  }
  	
  // Script loading
  function init () {
    console.log('mikeycell.loader.init');

    // Modernizr loads scripts and starts the app afterwards
    Modernizr.load({  
      load: ['../../scripts/jquery-1.8.2.min.js', 
						 'scripts/pattern.js',
             'scripts/logo.js',  
             'scripts/screens.js'],
      complete: function () {
				// display splash screen at startup, defined in screens.js
        mikeycell.screens.start();
      }
    });
  }
  
  // Publicly available methods of mikeycell.loader
  return {
    run: run
  };
  
})();

// Load scripts and initialize the app
mikeycell.loader.run();