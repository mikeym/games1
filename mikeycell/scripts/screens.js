// MikeyCell Screen Scripts
// Michael Micheletti HTML5 Gameplay homework project

// Global game object
var mikeycell = mikeycell || { };

// Shared screen handling
mikeycell.screens = (function () {
  'use strict';
    
  // Show the screen with the given id
  function showScreen (screenId) {
    console.log('mikeycell.screens.showScreen ' + screenId);
    
    var $currentScreen = $('#game .screen.active'),
        $nextScreen = $('#' + screenId)
    if ($currentScreen) {
      $currentScreen.removeClass('active');
    }
    if ($nextScreen) {
      $nextScreen.addClass('active');
      mikeycell.screens[screenId].run();
    }
  }
  
  // Initialize by displaying the splash screen
  function start () {
    console.log('mikeycell.screens.start');
    
    // draw background pattern behind other elements, redraw after resizing
		// aka 'the hard way'
    mikeycell.pattern.drawDiamondPatternBackground( $('body') );
		$(window)
			.resize(function (event) {
				$('#patternBkgdCanvas').remove();
				mikeycell.pattern.drawDiamondPatternBackground( $('body') );
			}
		);
    
    showScreen('splashScreen');
  }
  
  // Publicly available methods of mikeycell.screens
  return {
    showScreen: showScreen,
    start: start
  };
})();


// Splash screen handling
mikeycell.screens.splashScreen = (function () {
  'use strict';
  
  var needsInit = true;
  
  // Initialize splash screen if needed
  function run () {    
    console.log('mikeycell.screens.splashScreen.run');
    
    // one-time initialization
    if (needsInit) {
      // draw logo
      var $canvasBox = $('#splashLogoBox');    
      mikeycell.logo.drawLogo($canvasBox, true);
      
      $('#splashScreen')
        // show menu screen when you click anywhere
        .click( function (event) {
            mikeycell.screens.showScreen('menuScreen');
          }
        );
    }
    needsInit = false;
  }
  return { run: run };
  
})();


// Menu screen handling
mikeycell.screens.menuScreen = (function () {
  'use strict';

  var needsInit = true;
  
  // Run when the menu screen is displayed
  function run () {        
    console.log('mikeycell.screens.menuScreen.run');

    // one-time initialization
    if (needsInit) {
      // draw logo, in timeout to permit webfont to load in safari / chrome
      var $canvasBox = $('#menuLogoBox');
      mikeycell.logo.drawLogo($canvasBox, false);
      
      $('#menuScreen button')
        // navigate to the screen stored in the button's data
        .click( function (event) {
          var nextScreenId = $(event.target).data('screen');
          mikeycell.screens.showScreen(nextScreenId);
        }
      );
      
      // redraw logo when window is resized
      $(window)
        .resize(function (event) {
          $canvasBox.empty();
          mikeycell.logo.drawLogo($canvasBox, false);
        }
      );
    }
    needsInit = false;
  }
  return { run: run };
  
})();

// About screen handling
mikeycell.screens.aboutScreen = (function () {
  'use strict';

  var needsInit = true;
  
  // Run when the about screen is displayed
  function run () {
    console.log('mikeycell.screens.aboutScreen.run');
    
    // one-time initialization
    if (needsInit) {
      // draw logo
      var $canvasBox = $('#aboutLogoBox');
      mikeycell.logo.drawLogo($canvasBox, false);

      $('#aboutMenuButton')
        // navigate to the screen stored in the button's data
        .click( function (event) {
          var nextScreenId = $(event.target).data('screen');
          mikeycell.screens.showScreen(nextScreenId);
        }
      );
      
      // redraw logo when window is resized
      $(window)
        .resize(function (event) {
          $canvasBox.empty();
          mikeycell.logo.drawLogo($canvasBox, false);
        }
      );
    }
    needsInit = false;
  }
  return { run: run };
  
})();

// Settings screen handling
mikeycell.screens.settingsScreen = (function () {
  'use strict';

  var needsInit = true;
  
  // Run when the settings screen is displayed
  function run () {
    console.log('mikeycell.screens.settingsScreen.run');
    
    // one-time initialization
    if (needsInit) {
      // draw logo
      var $canvasBox = $('#settingsLogoBox');
      mikeycell.logo.drawLogo($canvasBox, false);
      
      // just this one button for now, probably more later
      // may want to move this to a separate file if it gets too big
      $('#settingsMenuButton')
        // navigate to the screen stored in the button's data
        .click( function (event) {
          var nextScreenId = $(event.target).data('screen');
          mikeycell.screens.showScreen(nextScreenId);
        }
      );
      
      // redraw logo when window is resized
      $(window)
        .resize(function (event) {
          $canvasBox.empty();
          mikeycell.logo.drawLogo($canvasBox, false);
        }
      );
    }
    needsInit = false;
  }
  return { run: run };
  
})();

// Game screen handling
// This will need to migrate later once it gets interesting
mikeycell.screens.gameScreen = (function () {
  'use strict';

  var needsInit = true;
  
  // Run when the game screen is displayed
  function run () {
    console.log('mikeycell.screens.gameScreen.run');
    
    // menu/logo one-time initialization
    if (needsInit) {
      // draw logo
      var $canvasBox = $('#gameLogoBox');
      mikeycell.logo.drawLogo($canvasBox, false);

      $canvasBox
        // always goes to the menu
        .click( function (event) {
          mikeycell.screens.showScreen('menuScreen');
        }
      );
    }
    needsInit = false;
  }
  return { run: run };
  
})();
