// Form-based play for MikeyCell, HTML5 Gameplay

var mikeycell = mikeycell || {};

mikeycell.playform = (function () {
  var that = this, // Reference to playform available within closures
      m = mikeycell,
      inputCard = document.getElementById('theCard'),
      inputDest = document.getElementById('theDest'),
      moveButton = document.getElementById('moveBtn'),
      inputResult = document.getElementById('theResult');
  
  if (m.debug > m.NODEBUG) { console.log('playform'); }
  
  // Expects a card code entered in the card field ('2D') and
  // a destination code entered in the destination field ('F1')
  moveButton.onclick = function() {
    var cardCode = inputCard.value,
        destCode = inputDest.value,
        theCard,
        locationConstant;

    if (m.debug === m.DEBUGALL) { console.log('playform.moveButton.onclick: ' + cardCode + ', ' + destCode); }
    
    // get a card object by rank and suit
    theCard = getCardByRankAndSuit(cardCode.toUpperCase(), m.Model.Deck);
    
    // get a location constant from the supplied code
    locationConstant = m.Model.Location.getLocationConstant(destCode.toUpperCase());
    
    if (theCard) {
      if (m.Model.pickUp(theCard)) {
        if (m.Model.putDown(theCard, locationConstant)) {
          m.view.refreshDisplay();
          inputResult.value = "Moved";
          inputCard.value = "";
          inputDest.value = "";
          inputCard.focus();
          return;
        } else {
          inputResult.value = "Can't put card there";
          return;
        }
      } else {
        inputResult.value = "Can't move card";
        return;
      }
    } else {
      inputResult.value = "Bad card code";
      return;
    }
    
    inputResult.value = "Error";
  }
  
  // Returns a specific card from the deck that corresponds to the given rank and suit ('AD')
  that.getCardByRankAndSuit = function ( cardRankAndSuit, theDeck ) {
    var i, // cards counter
        len = m.cards.CARDS_IN_DECK,
        theCard;
        
    for (i = 0; i < len; i++) {
      theCard = theDeck[i];
      if (theCard && theCard.rankAndSuit === cardRankAndSuit) {
        return theCard;
      }
    }
    
    return null; // if not found
  };

  return {
    getCardByRankAndSuit : that.getCardByRankAndSuit
  };
  
})();