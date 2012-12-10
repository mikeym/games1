// MikeyCell loader
// Michael Micheletti HTML5 Gameplay homework project

// Global game object
var mikeycell = mikeycell || { };

mikeycell.NODEBUG = 0;    // console logging off
mikeycell.DEBUGSOME = 1;  // console logging of top-level code
mikeycell.DEBUGALL = 2;   // console logging of detail methods and loops
mikeycell.DEBUGCRAZY = 3; // console logging of every last nutso thing

mikeycell.debug = mikeycell.NODEBUG; // current debugging level

mikeycell.PLAYNORMALLY = true; // set to false for testing win

console = window.console || { log: function() {} }; // ie console.log polyfill

// Loader property of the global object, used to initialize scripts
mikeycell.loader = (function () {
  var that = this,
      numResourcesToLoad = 0,
      numResourcesLoaded = 0,
      resourceListLg,
      resourceListSm,
      CARD_IMAGE_SUFFIX = ".png",
      CARD_IMAGE_WIDTH_LG = 113,  // desktop cards
      CARD_IMAGE_HEIGHT_LG = 157,
      CARD_IMAGE_WIDTH_SM = 51,   // iPhone landscape-sized
      CARD_IMAGE_HEIGHT_SM = 71,
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
  
  that.CARD_SIZE_LG = 1; // 113x157 cards
  that.CARD_SIZE_SM = 2; // 51x71 cards
  
  //// Resource loading ////
  
  // Allows files prefixed by "res!" to be loaded as resources
  function setResourcePrefix( ) {
    if (m.debug === m.DEBUGALL) { console.log('loader.setResourcePrefix'); }
    
    yepnope.addPrefix("res", function( resourceObj ) {
        resourceObj.noexec = true;
        return resourceObj;
      });
   }  
   
  // returns an array of card image resources, either large or small
  function listCardResources( that, size ) {
    if (m.debug === m.DEBUGALL) { console.log('loader.listCardResources' + size); }

    // local function wraps card identifier with url and resource prefix
    var g = function ( cardRankPlusSuit ) {
      if (size && size === that.CARD_SIZE_SM) {
        return "res!cardimages51x71/" + cardRankPlusSuit + ".png";
      } else {
         return "res!cardimages113x157/" + cardRankPlusSuit + ".png";
      }
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
  that.CardImagesLg = { }; // 113x157
  that.CardImagesSm = { }; // 51x71
  
  // Adds a preloaded image to CardImagesLg with the card's rank and suit as the property index
  function addCardImageLg(url) {

    var patternRegexLg = /(cardimages113x157\/)([\w]+)(.png)/, // regex with substrings for obtaining rank and suit
        patternMatchLg = url.match(patternRegexLg), // creates an array item from the regex substrings
        imgLg = new Image();
        
    imgLg.width = CARD_IMAGE_WIDTH_LG;
    imgLg.height = CARD_IMAGE_HEIGHT_LG;
    imgLg.src = url;
    that.CardImagesLg[patternMatchLg[2]] = imgLg; // patternMatch[2] matches 'AD' in 'cardimages/AD.png'

    if (m.debug === m.DEBUGALL) { console.log('loader.addCardImageLg: ' + patternMatchLg[2] + ' ' + imgLg.src); }
  }
  
  // Adds a preloaded image to CardImagesSm with the card's rank and suit as the property index.
  // Same as above, less confusing this way...
  function addCardImageSm(url) {
                      // /(cardimages113x157\/)([\w]+)(.png)/
    var patternRegexSm = /(cardimages51x71\/)([\w]+)(.png)/, // regex with substrings for obtaining rank and suit
        patternMatchSm = url.match(patternRegexSm), // creates an array item from the regex substrings
        imgSm = new Image();
        
    imgSm.width = CARD_IMAGE_WIDTH_SM;
    imgSm.height = CARD_IMAGE_HEIGHT_SM;
    imgSm.src = url;
    that.CardImagesSm[patternMatchSm[2]] = imgSm; // patternMatch[2] matches 'AD' in 'cardimages/AD.png'

    if (m.debug === m.DEBUGALL) { console.log('loader.addCardImageLg: ' + patternMatchSm[2] + ' ' + imgSm.src); }
  }
  
  // Returns a preloaded Image element from the cardImages
  function getCardImage ( cardRankPlusSuit, size ) {
    if (m.debug === m.DEBUGALL) { console.log('loader.getCardImage: ' + cardRankPlusSuit + ', ' + size ); }
    
    if (size && size === that.CARD_SIZE_SM) {
      return that.CardImagesSm[cardRankPlusSuit];
    } else {
      return that.CardImagesLg[cardRankPlusSuit];
    }
  }
    
  //// Script loading ////
  
  // Script loading
  function init () {
    if (m.debug > m.NODEBUG) { console.log('loader.init'); }
  
    // prepare list of card image resources to load, initialize counters
    setResourcePrefix( );
    resourceListLg = listCardResources(that, that.CARD_SIZE_LG);
    resourceListSm = listCardResources(that, that.CARD_SIZE_SM);
    numResourcesToLoad = resourceListLg.length + resourceListSm.length;
    numResourcesLoaded = 0

    // Modernizr loads scripts and starts the app afterwards
    Modernizr.load([ 
      // scripts
      {
        load: ['scripts/jquery-1.8.2.min.js', 
               'scripts/pattern.js',
               'scripts/logo.js',  
               'scripts/storage.js',
               'scripts/settings.js',
               'scripts/screens.js',
               'scripts/playingcards.js',
               'scripts/gamemodel.js',
               'scripts/gameviewcanvas.js',
               'scripts/gameloop.js',
               'scripts/playtouch.js',
               'scripts/audio.js',
               'scripts/sounds.js'], 
        complete: function () {
          // display splash screen at startup, defined in screens.js
          mikeycell.screens.start();
        },
      },
      // card images
      {
        load: resourceListLg,
        callback: function(url, result, key) {
          var pct = (numResourcesLoaded++ / numResourcesToLoad) * 100;
          mikeycell.screens.splashScreen.run(false, true, pct);
          addCardImageLg(url);
        },
      },
      {
        load: resourceListSm,
        callback: function(url, result, key) {
          var pct = (numResourcesLoaded++ / numResourcesToLoad) * 100;
          mikeycell.screens.splashScreen.run(false, true, pct);
          addCardImageSm(url);
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
    getCardImage : getCardImage,
    CARD_SIZE_LG : CARD_SIZE_LG,
    CARD_SIZE_SM : CARD_SIZE_SM
  };
  
})();

// Load scripts and initialize the app
mikeycell.loader.run();