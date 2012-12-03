// MikeyCell loader
// Michael Micheletti HTML5 Gameplay homework project

// Global game object
var mikeycell = mikeycell || { };

mikeycell.NODEBUG = 0;    // console logging off
mikeycell.DEBUGSOME = 1;  // console logging of top-level code
mikeycell.DEBUGALL = 2;   // console logging of detail methods and loops
mikeycell.DEBUGCRAZY = 3; // console logging of every last nutso thing

mikeycell.debug = mikeycell.DEBUGALL; // current debugging level

console = window.console || { log: function() {} }; // ie console.log polyfill

// Loader property of the global object, used to initialize scripts
mikeycell.loader = (function () {
  var that = this,
      numResourcesToLoad = 0,
      numResourcesLoaded = 0,
      resourceList,
      CARD_IMAGE_FOLDER = "cardimages/",
      CARD_IMAGE_SUFFIX = ".png",
      CARD_IMAGE_WIDTH = 113,
      CARD_IMAGE_HEIGHT = 157;
      m = mikeycell;
      
  'use strict';
  
  if (m.debug > m.NODEBUG) { console.log('loader'); }
  
  // Initializes if needed
  function run () {
  if (m.debug > m.NODEBUG) { console.log('loader.run'); }

    var firstRun = true;
    if ( firstRun ) {
      init();
      firstRun = false;  
    }
  }
  
  //// Resource loading ////
  
  // Allows files prefixed by "res!" to be loaded as resources
  function setResourcePrefix( ) {
    if (m.debug === m.DEBUGALL) { console.log('loader.setResourcePrefix'); }
    
    yepnope.addPrefix("res", function( resourceObj ) {
        resourceObj.noexec = true;
        return resourceObj;
      });
   }  
   
  // returns an array of card image resources
  function listCardResources( that ) {
    if (m.debug === m.DEBUGALL) { console.log('loader.listCardResources'); }
    
    // TODO Pass in a function, one for big images, one for small ones.

    // local function wraps card identifier with url and resource prefix
    var g = function ( cardRankPlusSuit ) {
      return "res!cardimages/" + cardRankPlusSuit + ".png";
    }

    // array of resource urls returned to the loader
    return [
      g('AD'), g('2D'), g('3D'), g('4D'), g('5D'), g('6D'),  g('7D'), g('8D'), g('9D'), g('10D'), g('JD'), g('QD'), g('KD'),
      g('AS'), g('2S'), g('3S'), g('4S'), g('5S'), g('6S'),  g('7S'), g('8S'), g('9S'), g('10S'), g('JS'), g('QS'), g('KS'),
      g('AH'), g('2H'), g('3H'), g('4H'), g('5H'), g('6H'),  g('7H'), g('8H'), g('9H'), g('10H'), g('JH'), g('QH'), g('KH'),
      g('AC'), g('2C'), g('3C'), g('4C'), g('5C'), g('6C'),  g('7C'), g('8C'), g('9C'), g('10C'), g('JC'), g('QC'), g('KC') 
      ];
  }
  
  // Contains 52 properties identified by rank and suit ('AD'), each containing a preloaded image element
  // Accessed using getCardImage( 'AD' )
  // Loaded by addCardImage( url )
  that.CardImages = { };
  
  // TODO add a smaller card images object
  
  // Adds a preloaded image to the cardImages object with the card's rank and suit as the property index
  function addCardImage(url) {

    // TODO pass in a regex pattern? or a switch to select the one you want.
    // then have a small set of images

    var patternRegex = /(cardimages\/)([\w]+)(.png)/, // regex with substrings for obtaining rank and suit
        patternMatch = url.match(patternRegex); // creates an array item from the regex substrings
        img = new Image();
    img.width = CARD_IMAGE_WIDTH;
    img.height = CARD_IMAGE_HEIGHT;
    img.src = url;
    that.CardImages[patternMatch[2]] = img; // patternMatch[2] matches 'AD' in 'cardimages/AD.png'

    if (m.debug === m.DEBUGALL) { console.log('loader.addCardImage: ' + patternMatch[2] + ' ' + img.src); }
  }
  
  // Returns a preloaded Image element from the cardImages
  function getCardImage ( cardRankPlusSuit ) {
    if (m.debug === m.DEBUGALL) { console.log('loader.getCardImage: ' + cardRankPlusSuit + " " + that.CardImages[cardRankPlusSuit]); }

    // TODO test viewport width here before returning the card
    // that way you can return different sized cards for different sized screens
    // also need to save differently sized cards
    
    return that.CardImages[cardRankPlusSuit];
  }
    
  //// Script loading ////
  
  // Script loading
  function init () {
    if (m.debug > m.NODEBUG) { console.log('loader.init'); }
  
    // prepare list of card image resources to load, initialize counters
    setResourcePrefix( );
    resourceList = listCardResources();
    numResourcesToLoad = resourceList.length;
    numResourcesLoaded = 0

    // Modernizr loads scripts and starts the app afterwards
    Modernizr.load([ 
      // scripts
      {
        load: ['../../scripts/jquery-1.8.2.min.js', 
               'scripts/pattern.js',
               'scripts/logo.js',  
               'scripts/screens.js',
               'scripts/playingcards.js',
               'scripts/gamemodel.js',
               'scripts/gameviewcanvas.js',
               'scripts/gameloop.js',
               'scripts/playtouch.js',
               'scripts/audio.js',
               'scripts/sounds.js',
               'scripts/settings.js'], 
        complete: function () {
          // display splash screen at startup, defined in screens.js
          mikeycell.screens.start();
        },
      },
      // card images
      {
        load: resourceList,
        callback: function(url, result, key) {
          var pct = (numResourcesLoaded++ / numResourcesToLoad) * 100;
          mikeycell.screens.splashScreen.run(false, true, pct);
          addCardImage(url);
        },
        complete: function() {
          numResourcesLoaded = numResourcesToLoad = 0;
          mikeycell.screens.splashScreen.run(true, false, 100);
        }
      }
    ]);
  }
  
  // Publicly available methods of mikeycell.loader
  return {
    run          : run,
    getCardImage : getCardImage
  };
  
})();

// Load scripts and initialize the app
mikeycell.loader.run();