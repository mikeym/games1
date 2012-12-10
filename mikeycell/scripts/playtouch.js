// Mouse and maybe touch interactions for the MikeyCell game controller

var mikeycell = mikeycell || {};

mikeycell.playtouch = (function () {
  var that = this,
      v = mikeycell.view,    // view shortcut
      m = mikeycell.Model,  // model shortcut
      d = mikeycell;        // for debugging
  
  if (d.debug > d.NODEBUG) { console.log('playtouch'); }
  
  // Enable mouse events when the game screen is visible
  function hookMouseEvents() {
    var ci = that.cardInfo;
    
    $('canvas').on({
      touchstart: function(e) {
        if (hasWon) {
          d.screens.showScreen('gameScreen')
        } else {
          pickUp(v.getCardAtEventPosition(e.originalEvent)); 
        }
        //return false;
      },
      touchend: function(e) {
        putDown(v.getLocationAtEventPosition(e.originalEvent));
        //return false;
      },
      touchmove: function(e) {
        moveCard(e.originalEvent);
        //return false;
      },
      mousedown: function(e) {
        if (hasWon) {
          d.screens.showScreen('gameScreen')
        } else {
          pickUp(v.getCardAtEventPosition(e)); 
        }
        return false;
      },
      mouseup: function(e) {
        putDown(v.getLocationAtEventPosition(e));
        return false;
      },
      mousemove: function(e) {
        moveCard(e);
        return false;
      },
			mouseleave: function(e) {
				leftCanvas(e);
				return false;
			}
    });
      
  };
  
  // Disable mouse events when we leave the game screen
  function unhookMouseEvents() {
    $('#gameCanvas').off(); 
  };
  
  // Pass along a moving card's position to the view for refreshing
  function moveCard(e) {
    v.moveCards(e);
  };
  
  // Called from mousedown handler, picks up a card if permitted and sets up the cardInfo array.
  function pickUp (card) {    
    if (card) {
  
      if (d.debug === d.DEBUGALL) { console.log('playtouch.pickUp ' + card.rankAndSuit); }
      
      // squirrel away where the card was originally, in case we have to put it back
      card.orig = card.location;
      
      // Model handles moving states and fallback
      m.pickUp(card)
    }
  }
  
  // Called from mouseup handler, places a card if permitted and clears the cardInfo array
  function putDown (dest) {    
    var i,
		    card;
    
    if (dest) {
    
      if (d.debug === d.DEBUGALL) { console.log('playtouch.putDown ' + dest); }
      
      // put card into intended location  
      for (i = 0; i < m.Moving.Cards.length; i++) {
        card = m.Moving.Cards[i];

        if (m.putDown(card, dest)) {
          card.orig = null;
        
        // oops, can't, so put card back where it came from  
        } else if (m.putDown(card, card.orig, true)) {
          card.orig = null;
        }
      }
    }
  }
	
	function leftCanvas () {
		var i,
		    card;
		if (d.debug >= d.DEBUGALL) { console.log('playtouch.leftCanvas'); }
		
		for (i = 0; i < m.Moving.Cards.length; i++) {
			card = m.Moving.Cards[i];
			if (card) {
				m.putDown(card, card.orig, true);
				card.orig = null;
			}
		}
	}
  
  // DEBUGGING
  printAllCardsAndLocations = function() {
    var out = '', i, j;
    for (i = 0, j = 0; i < 52; i++, j++) {
      out += m.Deck[i].rankAndSuit + '.' + m.Deck[i].location + ', ';
      if (j >= 5) { 
        out += '\n';
        j = 0; 
      }
    }
    console.log('Cards and Locations: \n' + out);
  }
  
  // DEBUGGING
  printMovingCardInfo = function() {
    console.log('movingCard: ' + 
      v.movingCard.card.rankAndSuit + ', ' +
      v.movingCard.cardX + ', ' +
      v.movingCard.cardY + ', ' +
      v.movingCard.offsetX + ', ' +
      v.movingCard.offsetY);
  }
  
  return { 
    hookMouseEvents : hookMouseEvents,
    unhookMouseEvents : unhookMouseEvents,
    printAllCardsAndLocations : printAllCardsAndLocations,
    printMovingCardInfo : printMovingCardInfo
    }
  
})();