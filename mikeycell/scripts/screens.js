// MikeyCell Screen Scripts
// Michael Micheletti HTML5 Gameplay homework project

// Global game object
var mikeycell = mikeycell || { };

// Shared screen handling
mikeycell.screens = (function () {
  var m = mikeycell;
  
  'use strict';
  
  if (m.debug > m.NODEBUG) { console.log('screens'); }
    
  // Show the screen with the given id
  function showScreen (screenId) {    
    var $currentScreen = $('#game .screen.active'),
        $nextScreen = $('#' + screenId)

  if (m.debug > m.NODEBUG) { console.log('screens.showScreen: ' + screenId); }

    if ($currentScreen) {
      $currentScreen.removeClass('active');
    }
    if ($nextScreen) {
      $nextScreen.addClass('active');
      m.screens[screenId].run();
    }
  }
  
  // Initialize by displaying the splash screen
  function start () {
    if (m.debug > m.NODEBUG) { console.log('screens.start'); }
    
    // draw background pattern behind other elements, redraw after resizing
    // aka 'the hard way'
    m.pattern.drawDiamondPatternBackground( $('body') );
    $(window)
      .resize(function (event) {
        $('#patternBkgdCanvas').remove();
        m.pattern.drawDiamondPatternBackground( $('body') );
      }
    );
    
    showScreen('splashScreen'); // without tagline or progress bar initially
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
  
  // Initialize splash screen if needed
  function run (showTagLine, showProgress, progressPct) {    
    var $canvasBox = $('#splashLogoBox');
  
    if (m.debug > m.NODEBUG) { console.log('screens.splashScreen.run'); }
    
    // Draws logo on the splash screen. Will be called from the loader multiple
    // times to display progress, and then to display the tagline when finished loading.
    mikeycell.logo.drawLogo($canvasBox, showTagLine, showProgress, progressPct);
  
    // Setup the click handler and pointer styling for the splash screen only after loading.  
    if (showTagLine) {
      $('#splashScreen')
        .css('cursor', 'pointer')
        .click( function (event) {
            // show menu screen when you click anywhere
            m.screens.showScreen('menuScreen');
          }
        );
    }
  }
  return { run: run };
  
})();


// Menu screen handling
mikeycell.screens.menuScreen = (function () {
  var needsInit = true;
  
  'use strict';
  
  // Run when the menu screen is displayed
  function run () {        
    if (m.debug > m.NODEBUG) { console.log('screens.menuScreen.run'); }

    // one-time initialization
    if (needsInit) {
      // draw logo, in timeout to permit webfont to load in safari / chrome
      var $canvasBox = $('#menuLogoBox');
      m.logo.drawLogo($canvasBox, false);
      
      $('#menuScreen button')
        // navigate to the screen stored in the button's data
        .click( function (event) {
          var nextScreenId = $(event.target).data('screen');
          m.screens.showScreen(nextScreenId);
        }
      );
      
      // redraw logo when window is resized
      $(window)
        .resize(function (event) {
          $canvasBox.empty();
          m.logo.drawLogo($canvasBox, false);
        }
      );
    }
    needsInit = false;
  }
  return { run: run };
  
})();

// About screen handling
mikeycell.screens.aboutScreen = (function () {
  var needsInit = true;
  
  'use strict';
  
  // Run when the about screen is displayed
  function run () {
    if (m.debug > m.NODEBUG) { console.log('screens.aboutScreen.run'); }
    
    // one-time initialization
    if (needsInit) {
      // draw logo
      var $canvasBox = $('#aboutLogoBox');
      m.logo.drawLogo($canvasBox, false);

      $('#aboutMenuButton')
        // navigate to the screen stored in the button's data
        .click( function (event) {
          var nextScreenId = $(event.target).data('screen');
          m.screens.showScreen(nextScreenId);
        }
      );
      
      // redraw logo when window is resized
      $(window)
        .resize(function (event) {
          $canvasBox.empty();
          m.logo.drawLogo($canvasBox, false);
        }
      );
    }
    needsInit = false;
  }
  return { run: run };
  
})();

// Settings screen handling
mikeycell.screens.settingsScreen = (function () {
  var needsInit = true;

  'use strict';
  
  // Run when the settings screen is displayed
  function run () {
    if (m.debug > m.NODEBUG) { console.log('screens.settingsScreen.run'); }
    
    // one-time initialization
    if (needsInit) {
      // draw logo
      var $canvasBox = $('#settingsLogoBox');
      m.logo.drawLogo($canvasBox, false);
      
      // just this one button for now, probably more later
      // may want to move this to a separate file if it gets too big
      $('#settingsMenuButton')
        // navigate to the screen stored in the button's data
        .click( function (event) {
          var nextScreenId = $(event.target).data('screen');
          m.screens.showScreen(nextScreenId);
        }
      );
      
      // redraw logo when window is resized
      $(window)
        .resize(function (event) {
          $canvasBox.empty();
          m.logo.drawLogo($canvasBox, false);
        }
      );
    }
    needsInit = false;
  }
  return { run: run };
  
})();

// Game screen handling
mikeycell.screens.gameScreen = (function () {
  var needsInit = true;
  
  'use strict';

  // Run when the game screen is displayed
  function run () {
    var $canvasBox;

    if (m.debug > m.NODEBUG) { console.log('screens.gameScreen.run'); }
    
    // menu/logo one-time initialization
    if (needsInit) {
      // draw logo
      $('#gameMenuLink')
        .click( function (event) {
          m.screens.showScreen('menuScreen');
        }
      );
      
      $('#newGameLink')
        .click( function (event) {
          m.screens.showScreen('gameScreen');
        }
      );
      
    }
    needsInit = false;
    
    // start a new game
    m.view.newGame($('#gameViewBox'));

    // if using character form, initialize it
    if (m.showPlayForm) {
      $('#charPlayForm').css('display', 'block');
      $('#theCard').val('');
      $('#theDest').val('');
      $('#theResult').val('');
    }
    
  }
  return { run: run };
  
})();
