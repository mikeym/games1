// Vector math library
// Mikey Micheletti, for Gameplay in HTML5

var app = app || {};

// 2D Vector functions
// To create a new vector with specific x and y values, supply them
// A null vector is created when arguments are not supplied
app.Vector = function (xVal, yVal) {
  var that = this;
  
  this.ERROR = 'ERROR', // all-purpose err flag
  this.x = typeof(xVal) === 'undefined' ? 0 : Number(xVal), //vector x, defaults to 0
  this.y = typeof(yVal) === 'undefined' ? 0 : Number(yVal); // vector y, defaults to 0
  
  // Local utility function to determine if a supplied value is numeric
  this.isNumber = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };
  
  // Utility function to test that the supplied argument is indeed a vector
  this.isVector = function (v) {
    var isAVector = false; // default fail    
    try {
      if (that.isNumber(v.x) && that.isNumber(v.y)) {
        isAVector = true;
      }
    } 
    catch (e) {};
    return isAVector;
  };
  
  // Utility function to test equality of this and some other vector
  this.isEqual = function (otherVector) {
    return (that.isVector(otherVector) && that.x === otherVector.x && that.y === otherVector.y);
  };
  
  // add two supplied vectors, or return the error flag
  this.add = function (v1, v2) {
    if (that.isVector(v1) && that.isVector(v2)) {
      return app.Vector(v1.x + v2.x, v1.y + v2.y);
    }     
    return that.ERROR; // validation failed
  };
  
  // subtract the second supplied vector from the first and return the new vector
  this.subtract = function(v1, v2) {
    if (that.isVector(v1) && that.isVector(v2)) {
      return app.Vector(v1.x - v2.x, v1.y - v2.y);
    } else {
      return that.ERROR;
    }
  };
  
  // multiply the supplied Vector by the supplied multiplier and return the new vector
  this.scalarMul = function(v1, multiplier) {
    if (that.isVector(v1) && that.isNumber(multiplier)) {
      return app.Vector(v1.x * multiplier, v1.y * multiplier);
    } 
    return that.ERROR; // validation failed
  };
  
  // returns the length of this Vector
  this.length = function() {
    if (that.isVector(that)) {
      return Math.sqrt( (that.x * that.x) + (that.y * that.y) ); 
    } 
    return that.ERROR; // validation failed
  };
  
  // returns a new normalized Vector using this vector's x and y properties
  this.normalize = function() {
    var len = that.length();
    if (that.isVector(that) && 
       !(that.x === 0 && that.y ===0) && // could isolate as isNullVector() method if needed later
       (len && len !== -1)) { // avoid divide by zero
        return app.Vector( (that.x / len), (that.y / len) );
    } 
    return that.ERROR; // validation failed
  }
  
  // returns the distance between two vectors as a single float value
  this.distance = function(v1, v2) {
    var vSub;
    if (that.isVector(v1) && that.isVector(v2)) {
      vSub = that.subtract(v1, v2);
      if (that.isVector(vSub)) {
        return vSub.length();
      }
    }
    return that.ERROR; // validation failed
  }
  
  // returns the dot product of two supplied vectors as a scalar
  this.dot = function(v1, v2) {
    var vSub;
    if (that.isVector(v1) && that.isVector(v2)) {
      return ( (v1.x * v2.x) + (v1.y * v2.y) );
    }
    return that.ERROR; // validation failed
  }

  // returns a new vector perpendicular to the supplied original
  this.perp = function(v1) {
    v1 = typeof(v1) === 'undefined' ? that : v1; // if no vector supplied, use this one
    if (that.isVector(v1)) {
      return app.Vector(-v1.y, v1.x);
    }
    return that.ERROR; // validation failed
  };
  
  return {
    x : this.x,
    y : this.y,
    isVector : this.isVector,
    isEqual : this.isEqual,
    add : this.add,
    subtract : this.subtract,
    scalarMul : this.scalarMul,
    length : this.length,
    normalize : this.normalize,
    distance : this.distance,
    dot : this.dot,
    perp : this.perp
  };
  
};