// Canvas homework library
// Mikey Micheletti, for Gameplay in HTML5

// Main app object
var app = app || {};

// Canvas graphics object
app.graphics = function () {
  var that = this,
      CIRCLE_START_ANGLE = 0,
      CIRCLE_END_ANGLE = 2 * Math.PI,
      ctx;
  
  // Set this objects context with a canvas graphics context
  this.setContext = function (canvasContext) {
    that.ctx = canvasContext; // hmm, how to check for validity?
  }
  
  // Creates a circular path with the supplied X Y center point and radius.
  this.circle = function (centerX, centerY, radius) {
    that.ctx.beginPath();
    that.ctx.arc(centerX, 
      centerY, 
      radius, 
      CIRCLE_START_ANGLE, 
      CIRCLE_END_ANGLE, 
      false);
  }
  
  // Strokes a circular path with the supplied X Y center point and radius.
  // Should be preceded by a strokeStyle statement.
  this.strokeCircle = function (centerX, centerY, radius) {
    that.circle(centerX, centerY, radius);
    that.ctx.stroke();
  }
  
  // Fills a circular path with the supplied X Y center point and radius.
  // Should be preceded by a fillStyle statement.
  this.fillCircle = function (centerX, centerY, radius) {
    that.circle(centerX, centerY, radius);
    that.ctx.fill();
  }
  
  // Creates a rounded rectangle's path where...
  // x, y is upper left corner of the rectangle
  // width, height defines the rectangle's dimensions
  // radius defines corner radius
  this.roundedRect = function (x, y, width, height, radius) {
    var ctx = that.ctx; // less typing...
    ctx.beginPath();
    
    // top line, upper right corner
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);

    // right line, lower right corner
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    
    // bottom line, lower left corner
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    
    // left line, upper left corner
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);  
  }
  
  // Strokes the path of a rounded rectangle, see roundedRect args
  // Should be preceded by a strokeStyle statement.
  this.strokeRoundedRect = function (x, y, width, height, radius) {
    that.roundedRect(x, y, width, height, radius);
    that.ctx.stroke();
  }
  
  // Fills a rounded rectangle's path, see roundedRect args
  // Should be preceded by a fillStyle statement.
  this.fillRoundedRect = function (x, y, width, height, radius) {
    that.roundedRect(x, y, width, height, radius);
    that.ctx.fill();
  }
  
  return {
    setContext : this.setContext,
    circle : this.circle,
    strokeCircle : this.strokeCircle,
    fillCircle : this.fillCircle,
    roundedRect : this.roundedRect,
    strokeRoundedRect : this.strokeRoundedRect,
    fillRoundedRect : this.fillRoundedRect
  };
};
