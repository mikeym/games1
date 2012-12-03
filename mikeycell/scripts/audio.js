// MikeyCell Audio scripts
// Michael Micheletti HTML5 Gameplay homework project

// Global game object
var mikeycell = mikeycell || { };

// Shared audio handling
mikeycell.Audio = (function () {
  var that = this,
      audioFormat,
      audioFormatExtensions = [ "ogg", "mp3" ],
      audioFilePrefix = "sounds/",
      m = mikeycell;
  
  'use strict';
  
  if (m.debug > m.NODEBUG) { console.log('Audio'); }
  
  // Determine best audio format for this browser, runs at load time.
  that.initializeFormat = (function() {
    var i,
        capability;
    for (i = 0; i < audioFormatExtensions.length; i++) {
      capability = Modernizr.audio[ audioFormatExtensions[i] ];
      if (capability || 'probably' || capability === 'maybe') {
        audioFormat = audioFormatExtensions[i];
        if (m.debug >= m.DEBUGALL) { console.log('audio format: ' + audioFormat); }
        break;
      }
    }
  })();
  
  // Data structures for audio files,loaded via getAudio function
  that.audioElements = { };
  
  // Gets an Audio object corresponding to the supplied filename (minus extension).
  // Returns already-created audio object if we have one.
  that.getAudio = function(sound) {
    if (!audioElements[sound]) {
      audioElements[sound] = new Audio(audioFilePrefix + sound + '.' + audioFormat);
    }
    return(that.audioElements[sound]);
  };
  
  // List of sounds currently playing, added when played, removed when finished
  that.NowPlaying = { };
  
  // Removes sound from collection when stopped or paused
  that.donePlaying = function(e) {
    delete that.NowPlaying[e.target];
  };
  
  // Plays the requested sound or sounds based on the supplied argument.
  // If the arg is a string, pass to getAudio, get a sound, and play it.
  // If the arg is an object with a name, do the same.
  // If the arg has a names property whose value is a list of strings and a type, which
  //   may include a random selection request. If so, select one of the sounds and play it.
  // If the type is a sequence, play all the files in the names list.
  that.playAudio = function(aud) {
    var audioElements = [ ],
        i;
    
    if (m.debug >= m.DEBUGALL) { console.log('playAudio: ' + aud); }

    if (typeof aud  === "string") {
      audioElements[0] = that.getAudio(aud);
    
    } else if (aud && aud.name) {
      audioElements[0] = that.getAudio(aud.name);
      
    } else if (aud && aud.names && aud.type)  {
      if (aud.type === 'random') {
        audioElements[0] = that.getAudio(
          aud.names[Math.floor(Math.random() * aud.names.length)]
        );
      } else if (aud.type === 'sequence') {
        for (i = 0; i < aud.names.length; i++) {
          audioElements[i] = that.getAudio( aud.names[i] );
        }
      }
    }
  
    // Setup handlers to delete this audio element from the collection when it
    // stops playing, then play it.
    if (audioElements.length) {
      for (i = 0; i < audioElements.length; i++) {
        that.NowPlaying[audioElements[i]] = audioElements[i];
        if (m.debug >= m.DEBUGALL) { console.log(that.NowPlaying[audioElements[i]]); }
  
        audioElements[i].addEventListener('ended', donePlaying, false); 
        audioElements[i].addEventListener('pause', donePlaying, false); 
        audioElements[i].play();
      }
    }
  };
  
  // Stop all currently playing sounds. After the audio play stops,
  // the sound will be removed from the collection.
  that.beQuiet = function() {
    var sound;
    
    if (that.NowPlaying) {
      for (sound in that.NowPlaying) {
        if (that.NowPlaying.hasOwnProperty(sound)) {
          if (m.debug >= m.DEBUGALL) { console.log('Audio.beQuiet pausing'); }
          that.NowPlaying[sound].pause();
        }
      }
    }
  };
  
  return {
    playAudio    : that.playAudio,
    beQuiet      : that.beQuiet
  };

})();