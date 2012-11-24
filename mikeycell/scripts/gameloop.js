// Game timer loop for MikeyCell animations

var mikeycell = mikeycell || {};

mikeycell.gameloop = (function () {
  var that = this,
      m = mikeycell,
      loopFunc; // function to call every loop
      
  if (m.debug > m.NODEBUG) { console.log('gameloop'); }

  //// polyfills ////
  
  window.requestAnimationFrame =
    (function() {
      return window.requestAnimationFrame ||
             window.webkitRequestAnimationFrame ||
             window.mozRequestAnimationFrame ||
             window.oRequestAnimationFrame ||
             window.msRequestAnimationFrame ||
             
             function( callback, element ) {
                return window.setTimeout( 
                 function() {
                   callback( Date.now() );
                  }, 1000 / 60 );
               };
    })();
  
  window.cancelAnimationFrame =
    (function() {
      return window.cancelAnimationFrame ||
             window.cancelRequestAnimationFrame ||
             window.webkitCancelAnimationFrame ||
             window.webkitCancelRequestAnimationFrame ||
             window.mozCancelAnimationFrame ||
             window.mozCancelRequestAnimationFrame ||
             window.oCancelAnimationFrame ||
             window.oCancelRequestAnimationFrame ||
             window.msCancelAnimationFrame ||
             window.msCancelRequestAnimationFrame ||
             window.clearTimeout;
    })();
    
  //// Time ////
  
  // Returns the current system time, in seconds
  function getSystemSeconds( ) {
    return new Date().getTime() / 1000.0;
  }
    
  //// Loopyness ////
  
  // Sets the function called during the loop to the supplied function
  function setLoopFunction( func ) {
    if (m.debug === m.DEBUGALL) { console.log( 'gameloop.setLoopFunction( ' + func + ')' ); }
    loopFunc = func;
  };
  
  // Fires off the function, if any, and requests the next loop at the machine's convenience
  function doLoop( nowMillis ) {
    if ( typeof loopFunc === "function" ) {
      loopFunc( nowMillis / 1000.0 );
    }
    requestAnimationFrame( doLoop );
  }
  
  // Starts the Loop Of Eternity going
  requestAnimationFrame(doLoop);
    
  return { setLoopFunction : setLoopFunction };
  
})();