// MikeyCell local storage module
// Michael Micheletti HTML5 Gameplay homework project

// Global game object
var mikeycell = mikeycell || { };

// Uses local storage to squirrel away stuff and rummage around for it
mikeycell.Storage = (function () {
  var that = this,
      m = mikeycell;
  
  'use strict';
  
  if (m.debug > m.NODEBUG) { console.log('Storage'); }
  
  // Place some data identified by a key into local storage, or null if not found.
  that.put = function(theKey, theData) {
    localStorage.setItem(theKey, JSON.stringify(theData));
  };
  
  // Retrieve previously stored data identified by a key, or null if not found.
  that.get = function (theKey) {
    var value = localStorage.getItem(theKey)
    return value && JSON.parse(value);
  };
  
  // Remove some previously stored data.
  that.remove = function (theKey) {
    localStorage.removeItem(theKey);  
  };
  
  return {
    put    : that.put,
    get    : that.get,
    remove : that.remove
  }
  
})();