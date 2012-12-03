// MikeyCell settings scripts
// Michael Micheletti HTML5 Gameplay homework project

// Global game object
var mikeycell = mikeycell || { };

// Settings values used by the game
mikeycell.Settings = (function () {
  var that = this,
      m = mikeycell;
  
  'use strict';
  
  if (m.debug > m.NODEBUG) { console.log('Settings'); }

  // Sound and auto-move properties
  that.PlaySounds;
  that.AutoMove;
  
  // Setter for game sounds
  that.setPlaySounds = function (toPlay) {
    // TODO save settings with cookie etc
    that.PlaySounds = toPlay;
  }
  
  // Getter for game sounds
  that.getPlaySounds = function () {
    // TODO get settings from cookie etc
    return that.PlaySounds;
  }
  
  // Setter for auto-move
  that.setAutoMove = function(toAutoMove) {
    // TODO save settings with cookie etc
    that.AutoMove = toAutoMove;
  }
  
  // Getter for auto-move
  that.getAutoMove = function() {
    // TODO get settings from cookie etc
    return that.AutoMove;
  }
  
  // Initialize settings at load time, providing default values if needed
  that.init = (function() {
    var sounds = getPlaySounds(),
        moves = getAutoMove();
        
    if (sounds === undefined) {
      setPlaySounds(true); // Play sounds by default
    }
    if (moves === undefined) {
      setAutoMove(true); // Auto-move by default
    }
    
    if (m.debug >= m.DEBUGALL) { 
      console.log('Settings.init PlaySounds=' + that.PlaySounds + ' AutoMove=' + that.AutoMove); 
    }

  })()
  
  // Delay values for various in-game activities with and without sounds.
  that.Delays = {
    PutCard  : PlaySounds ? 80 : 35,
    AutoMove : PlaySounds ? 100 : 50,
    Shuffle  : PlaySounds ? 600 : 0,
    Win      : PlaySounds ? 1000 : 0,
    Quit     : PlaySounds ? 500 : 0
  }
  
  
  return {
    getPlaySounds : that.getPlaySounds,
    setPlaySounds : that.setPlaySounds,
    getAutoMove   : that.getAutoMove,
    setAutoMove   : that.setAutoMove,
    Delays        : that.Delays
  }
  
})();
