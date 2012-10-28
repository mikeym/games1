// MikeyCell diamond pattern canvas renderer
// For HTML5 Gameplay project

// Global game object
var mikeycell = mikeycell || { };

// Used to create a diamond pattern behind other elements
mikeycell.pattern = (function () {
  var that = this;
  
  // draws a diamond into a tiny canvas, for pattern use
  function drawSinglePatternElement() {
    var $canvas = $("<canvas />")[0], // create a canvas
        ctx = $canvas.getContext('2d');
        
    console.log('mikeycell.pattern.drawSinglePatternElement');
    
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
    
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(17,36,59, 0.75)";
    ctx.closePath();
    ctx.stroke();
    
    return $canvas;
  };
  
  // creates a canvas with a faint diamond pattern behind other elements on the page
  function drawDiamondPatternBackground($canvasBox) {
    var $canvas = $("<canvas id='patternBkgdCanvas'>MikeyCell</canvas>")[0], // create a canvas
        width = $canvas.width = $canvasBox.width(), // as wide as container
        height = $canvas.height = $canvasBox.height(), // as tall as container
        $patternElement = drawSinglePatternElement(), // canvas we'll repeat
        ctx, // large background canvas context
        pattern; // pattern we'll create
        
    console.log('mikeycell.pattern.drawDiamondPatternBackground');

    // create canvas and get its context
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