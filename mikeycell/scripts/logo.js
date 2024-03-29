// MikeyCell logo canvas renderer
// For HTML5 Gameplay project

// Global game object
var mikeycell = mikeycell || { };

// Used to create the MikeyCell logos used in the game
mikeycell.logo = (function () {
  var that = this,
      m = mikeycell;
      
  if (m.debug > m.NODEBUG) { console.log('logo'); }
  
  // draw our logo within the supplied container element
  // when showTag is true, writes "let's play" below spade symbol
  // when showProgress is true, turns off tag and displays progress bar of progressPct length
  function drawLogo($canvasBox, showTag, showProgress, progressPct, colorIndex) {
    var $canvas = $('<canvas>MikeyCell</canvas>')[0],
        width = $canvas.width = $canvasBox.width(), // as wide as container
        height = $canvas.height = $canvasBox.height(), // as tall as container
        centerX = width / 2, // X-axis center
        centerY = height / 2, // Y-axis center
        angle = Math.PI * 0.6, // angle of arc
        fontSizePixels = height / 7, // seems about right for the arc text
        radius = height / 2.25, // again, looks right
        textLogo = "MikeyCell",
        textSpade = "♠", // need to use actual spade character, not unicode. hmm...
        textTag = "Let's Have Some Fun!",
        progressBar1PctWidth = (width / 2) / 100, // 1% progress bar tick
        computedProgressBarWidth,
        i = 0, // loop counter for transfom
        ctx, // canvas context, we'll assign in a sec
        fillColors = ["#8C3B1D", "#C95D37"]; // darker and lighter colors, see mikeycell.css for palette
        
    if (m.debug === m.DEBUGALL) { console.log('logo.drawLogo: ' + 
      showTag + ', ' + showProgress + ', ' + progressPct); }

    // create canvas and get its context
    $($canvasBox).html($canvas);
    ctx = $canvas.getContext('2d');
          
    // General text properties for arc logo
    ctx.font = "" + fontSizePixels + "px cboxregular";
    ctx.textAlign = "center";
    ctx.fillStyle = fillColors[colorIndex];
    ctx.shadowColor = "#08111C";
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    // Arc 'MikeyCell' logo
    ctx.save();
    ctx.translate(centerX, centerY + (centerY / 4));
    ctx.rotate( -1 * angle / 2.12 );
    ctx.rotate( -1 * (angle / textLogo.length) / 2 );
    for (i = 0; i <  textLogo.length; i++) {
      ctx.rotate(angle / textLogo.length);
      ctx.save();
      ctx.translate(0, -1 * radius);
      ctx.fillText(textLogo[i], 0, 0);
      ctx.restore();
    }
    ctx.restore();

    // resize and reposition text for spade symbol
    ctx.font = "" + (fontSizePixels * 3.3) + "px cboxregular";
    ctx.save();
    ctx.fillText(textSpade, width / 2, (height / 5) * 3 );
    ctx.restore();
    
    // If we want a progress bar
    if (showProgress) {
      showTag = false;  // don't show the tagline, progress bar is there
      if (progressPct && parseInt(progressPct) > 0) {
        progressBarCurrentWidth = progressBar1PctWidth * parseInt(progressPct);
      ctx.beginPath();
      ctx.rect(width / 4, height - (2 * fontSizePixels), progressBarCurrentWidth, 5);
      ctx.fill();
      }
    }
    
    // tagline below if requested
    if (showTag) {
      ctx.font = "" + (fontSizePixels / 1.95) + "px cboxregular";
      ctx.save();
      ctx.fillText(textTag, width / 2, height - (2 * fontSizePixels));
      ctx.restore();
    }
    
  }
  
  return { drawLogo : drawLogo };
  
})();