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
    $(window).on('resize orientationchange', function (event) {
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
    var $canvasBox = $('#splashLogoBox'),
        fillBrightness = $canvasBox.width() < 420 ? 1 : 0;
  
    if (m.debug > m.NODEBUG) { console.log('screens.splashScreen.run'); }
    
    // Draws logo on the splash screen. Will be called from the loader multiple
    // times to display progress, and then to display the tagline when finished loading.
    // Brighter color for smaller screens
    mikeycell.logo.drawLogo($canvasBox, showTagLine, showProgress, progressPct, fillBrightness);
  
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
      // draw logo
      var $canvasBox = $('#menuLogoBox');
      m.logo.drawLogo($canvasBox, false, 0, 0, 0);
      
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
          m.logo.drawLogo($canvasBox, false, 0, 0, 0);
        }
      );
    }
    needsInit = false;
    
    // Turn off sounds, game loop and mouse event handling in game screen
    m.Audio.beQuiet();
    m.gameloop.setLoopFunction(null);
    m.playtouch.unhookMouseEvents();
    
    
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
      m.logo.drawLogo($canvasBox, false, 0, 0, 0);

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
          m.logo.drawLogo($canvasBox, false, 0, 0, 0);
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
    var autoMove = m.Settings.getAutoMove(),
        playSounds = m.Settings.getPlaySounds();
        
    if (m.debug > m.NODEBUG) { console.log('screens.settingsScreen.run'); }
    
    // one-time initialization
    if (needsInit) {
      // draw logo
      var $canvasBox = $('#settingsLogoBox');
      m.logo.drawLogo($canvasBox, false, 0, 0, 0);
      
      // just this one button for now, probably more later
      // may want to move this to a separate file if it gets too big
      $('#settingsMenuButton')
        // navigate to the screen stored in the button's data
        .click( function (event) {
          var nextScreenId = $(event.target).data('screen');
          m.screens.showScreen(nextScreenId);
        }
      );
      
      // Play sounds checkbox initialization and handling
      $('#playSoundsChk')
        .prop('checked', playSounds)
        .change( function() {
          m.Settings.setPlaySounds($(this).prop('checked'));
        });
      
      // Autoplay checkbox initialization and handling  
      $('#autoPlayChk')
        .prop('checked', autoMove)
        .change( function() {
          m.Settings.setAutoMove($(this).prop('checked'));
        });
      
      // redraw logo when window is resized
      $(window)
        .resize(function (event) {
          $canvasBox.empty();
          m.logo.drawLogo($canvasBox, false, 0, 0, 0);
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
    
    if (needsInit) {
      
      // disable mouse events on canvas and halt the game loop when we return to the menu
      $('#gameMenuLink')
        .click( function (event) {
          m.playtouch.unhookMouseEvents();
          m.Model.stopGameNow();
          m.Audio.beQuiet();
          m.screens.showScreen('menuScreen');
      });
      
      // shuffle and deal if we ask nicely
      $('#newGameLink')
        .click( function (event) {
          // if you start a new game before winning, give 'em the not impressed face
          if (m.Settings.getPlaySounds() && !hasWon) {
            m.Sounds.playSoundFor(m.Sounds.QUIT);
          }
          // now we play
          setTimeout( function() {
            m.Model.stopGameNow();
            m.screens.showScreen('gameScreen');
          }, m.Settings.Delays.Quit);
      });
      
    }
    needsInit = false;
    
    // start the game animation loop
    m.gameloop.setLoopFunction(m.view.refreshDisplay);
    
    // start a new game
    m.view.newGame($('#gameViewBox'));
    
    // hook up event handling
    m.playtouch.hookMouseEvents();    

    // resize the game pane if needed
    $(window)
      .resize(function (event) {
        m.view.setMetrics();
    });

  }
  return { run: run };
  
})();
