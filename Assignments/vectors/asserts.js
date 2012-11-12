// Simple test functions courtesy of John Resig
// From "Secrets of the JavaScript Ninjas"
(function() {
  var queue = [], 
      paused = false, 
      results;
  
  // Wants a ul element with id of "results" to push pass/fail list items into...    
  this.test = function(name, fn) {
    queue.push(function() {
      results = document.getElementById("results");
      results = assert(true, name).appendChild(
          document.createElement("ul"));
      fn();
    });
    runTest();
  };
  
  this.pause = function() {
    paused = true;
  };
  
  this.resume = function() {
    paused = false;
    setTimeout(runTest, 1);
  };
  
  function runTest() {
    if (!paused && queue.length) {
      queue.shift()();
      if (!paused) {
        resume();
      } 
    } 
  } 
  
  this.assert = function assert(value, desc) {
    var li = document.createElement("li");
    li.className = value ? "pass" : "fail";
    li.appendChild(document.createTextNode(desc));
    results.appendChild(li);
    if (!value) {
      li.parentNode.parentNode.className = "fail";
    } 
    return li;
  };
})();
 
