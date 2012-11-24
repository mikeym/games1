// MikeyCell diamond pattern canvas renderer
// For HTML5 Gameplay project

// Global game object
var mikeycell = mikeycell || { };

// Used to create a diamond pattern behind other elements
mikeycell.pattern = (function () {
  var that = this,
      m = mikeycell;
  
  if (m.debug > m.NODEBUG) { console.log('pattern'); }
  
  // draws a diamond into a tiny canvas, for pattern use
  function drawSinglePatternElement() {
    var $canvas = $("<canvas />")[0], // create a canvas
        ctx = $canvas.getContext('2d');
        
    if (m.debug === m.DEBUGALL) { console.log('pattern.drawSinglePatternElement'); }
    
    // set context canvas dimensions 20x24
    ctx.canvas.width = 14;
    ctx.canvas.height = 18;
    
    // diamond path
    ctx.beginPath();
    ctx.moveTo( 7,  0); // top corner
    ctx.lineTo(14,  9); // right corner
    ctx.lineTo( 7, 18); // bottom corner
    ctx.lineTo( 0,  9); // left corner
    ctx.lineTo( 7,  0); // back to top
    
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "rgba(0,0,0, 0.95)";
    ctx.closePath();
    ctx.stroke();
    
    return $canvas;
  };
  
  // creates a canvas with a faint diamond pattern behind other elements on the page
  function drawDiamondPatternBackground($canvasBox) {
    var width = $canvasBox.width(),      // width of containing element
        height = $canvasBox.height(),    // height of containing element
        $canvas,                        // canvas element we'll create if space permits
        $patternElement,                // single diamond in the pattern
        ctx,                            // 2D canvas context
        pattern;                        // overall pattern
        
        
    if (m.debug === m.DEBUGALL) { console.log('pattern.drawDiamondPatternBackground'); }

    // Only create the canvas and pattern if it's being shown. Omitted on smaller devices.
    // 750 pixel threshold set in CSS
    if (width <= 750) {
      return;
    }
    
    // still here? then draw the pattern
    $canvas = $("<canvas id='patternBkgdCanvas'>MikeyCell</canvas>")[0]; // create a canvas
    $canvas.width = width; // as wide as container
    $canvas.height = height; // as tall as container
    $patternElement = drawSinglePatternElement(); // single element in a canvas we'll repeat

    ctx = $canvas.getContext('2d');
    pattern = ctx.createPattern($patternElement, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, width, height);
    ctx.fill();
    
    // add at the top of the body tag, positioned and styled in mikeycell.css
    $($canvas).prependTo($canvasBox);    
  };

  return { drawDiamondPatternBackground : drawDiamondPatternBackground }
  
})();