// Gameplay assignment 1, 10/6/2012, Michael Micheletti

// Global app object, don't stomp
var app = app || { };

// App startup, will be called by the loader, sets up event handlers
app.start = function () {
  'use strict';

  // When buttons are clicked, display a message composed from button attributes
  $('button')
    .click(function (event) {
      var elem = event.target,
          elemId = $(elem).attr('id'),
          elemText = $(elem).text();
      $('#message span')
          .first().text(elemText) // button text in the first span
          .end()
          .last().text(elemId); // button id in the second span
    });
};
