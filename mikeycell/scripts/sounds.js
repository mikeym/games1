// MikeyCell sounds scripts
// Michael Micheletti HTML5 Gameplay homework project

// Global game object
var mikeycell = mikeycell || { };

// Sounds and handling specific to the game
mikeycell.Sounds = (function () {
  var that = this,
      m = mikeycell,
      a = mikeycell.Audio;
  
  'use strict';
  
  if (m.debug > m.NODEBUG) { console.log('Sounds'); }
  
  // Sounds associated with game events, correspond to filenames minus extensions
  that.SoundMap = {
    win: { names: ['applause1', 'applause2'], type: 'random' },
    quit: { names: ['aww', 'aww2', 'giggle' ], type: 'random' },
    putcard: { names: ['carddrop5', 'carddrop6'], type: 'random' },
    error: 'oops1',
    shuffle: { names: ['shuffle1', 'shuffle2'], type: 'random' }
  };
  
  // Publicly available constants corresponding to game events
  that.WIN = 1;
  that.QUIT = 2;
  that.PUTCARD = 3;
  that.ERROR = 4;
  that.SHUFFLE = 5;
  
  // Publicly available method to play one of the game event sounds via our audio library
  that.playSoundFor = function(theEvent) {
    if (m.debug >= m.DEBUGALL) { console.log('Sounds.playSoundFor' + theEvent); }
    switch (theEvent) {
      case that.PUTCARD:
        a.playAudio(that.SoundMap.putcard);
        break;
      case that.SHUFFLE:
        a.playAudio(that.SoundMap.shuffle);
        break;
      case that.ERROR:
        a.playAudio(that.SoundMap.error);
        break;
      case that.QUIT:
        a.playAudio(that.SoundMap.quit);
        break;
      case that.WIN:
        a.playAudio(that.SoundMap.win);
        break;
    }
  };
  
  return {
      WIN          : that.WIN,
      QUIT         : that.QUIT,
      PUTCARD      : that.PUTCARD,
      ERROR        : that.ERROR,
      SHUFFLE      : that.SHUFFLE,
      playSoundFor : that.playSoundFor
  };
  
})();