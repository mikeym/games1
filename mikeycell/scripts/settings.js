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
  
  // Local properties for speedier delay lookups
  that.PlaySounds;
  that.AutoMove;
  
  // Setter for game sounds, sets storage and local prop
  that.setPlaySounds = function (toPlay) {
    PlaySounds = toPlay;
    m.Storage.put('playSounds', toPlay);
  }
  
  // Getter for game sounds, will set sound on if previously undefined
  that.getPlaySounds = function () {
    var localSounds = m.Storage.get('playSounds');
    
    if (localSounds !== null) {
      return localSounds;
    } else {
      setPlaySounds(true);
      return true;
    }
  }
  
  // Setter for auto-move, sets storage and local prop
  that.setAutoMove = function(toAutoMove) {
    AutoMove = toAutoMove;
    m.Storage.put('autoMove', toAutoMove);
  }
  
  // Getter for auto-move, will set to true if previously undefined
  that.getAutoMove = function() {
    var localMove = m.Storage.get('autoMove');
    
    if (localMove !== null) {
      return localMove;
    } else {
      setAutoMove(true);
      return true;
    }
  }
  
  // Delay values for various in-game activities with and without sounds.
  // These use local properties since they're frequently called.
  that.Delays = {
    PutCard  : that.PlaySounds ? 80 : 35,
    AutoMove : that.PlaySounds ? 100 : 50,
    Shuffle  : that.PlaySounds ? 600 : 0,
    Win      : that.PlaySounds ? 1000 : 0,
    Quit     : that.PlaySounds ? 500 : 0
  }
  
  
  return {
    getPlaySounds : that.getPlaySounds,
    setPlaySounds : that.setPlaySounds,
    getAutoMove   : that.getAutoMove,
    setAutoMove   : that.setAutoMove,
    Delays        : that.Delays
  }
  
})();
