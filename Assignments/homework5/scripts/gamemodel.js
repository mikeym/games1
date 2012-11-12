// Game model for MikeyCell, for HTML5 Gameplay

// Array removeItem - By John Resig (MIT Licensed)
// Usage: myArray.remove(1); // removes second item from array
Array.prototype.removeItem = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

var app = app || {};

// The model
app.Model = (function () {
  var that = this; // Reference to app.model available within closures

  //// Constants ////
  
  // Various constants for location and error handling      
  that.IN_DECK = 0;      // Card is in the deck, not laid out
  that.CELL1 = 1;        // Leftmost single card cell
  that.CELL2 = 2;
  that.CELL3 = 3;
  that.CELL4 = 4;
  that.CELL_SET = [that.CELL1, that.CELL2, that.CELL3, that.CELL4],
  that.FOUNDATION1 = 5;  // Leftmost foundation where cards are stacked Ace -> King
  that.FOUNDATION2 = 6;
  that.FOUNDATION3 = 7;
  that.FOUNDATION4 = 8;
  that.FOUNDATION_SET = [that.FOUNDATION1, that.FOUNDATION2, that.FOUNDATION3, that.FOUNDATION4],
  that.TABLEAU1 = 9;    // Leftmost tableau where cards are shuffled
  that.TABLEAU2 = 10;
  that.TABLEAU3 = 11;
  that.TABLEAU4 = 12;
  that.TABLEAU5 = 13;
  that.TABLEAU6 = 14;
  that.TABLEAU7 = 15;
  that.TABLEAU8 = 16;
  that.TABLEAU_SET = [that.TABLEAU1, that.TABLEAU2, that.TABLEAU3, that.TABLEAU4,
                      that.TABLEAU5, that.TABLEAU6, that.TABLEAU7, that.TABLEAU8],
  that.MOVING = 17;      // Card is being moved someplace
  that.EMPTY = '';      // Cell, Foundation, Tableau etc is empty
  that.OK = true;
  that.ILLEGAL = false;  // Go Directly To Jail, Do Not Pass Go...  
  that.dealing = false;  // set to true when dealing cards, for validation bypass 
  that.WINNER = 'WIN'; 
  
  //// Deck ////
  that.Deck = [ ]; // array of cards to be filled from shuffling
  
  //// Tableaux ////
  
  // Eight tableau at the bottom of the screen, cards fanned down
  that.Tableau = { };
  that.Tableau[TABLEAU1] = [ ];
  that.Tableau[TABLEAU2] = [ ];
  that.Tableau[TABLEAU3] = [ ];
  that.Tableau[TABLEAU4] = [ ];
  that.Tableau[TABLEAU5] = [ ];
  that.Tableau[TABLEAU6] = [ ];
  that.Tableau[TABLEAU7] = [ ];
  that.Tableau[TABLEAU8] = [ ];
  
  // Place a card into a tableau
  that.Tableau.place = function (card, tableau) {
    if (that.isAllowed( card, tableau )) {  // valid move?
      that.remove( card, card.location );    // remove from old location
      this[tableau].push(card);
      card.location = tableau;
      return OK;
    } else {
      return ILLEGAL;
    }
  };
  
  // Sort a deck of cards into the tableaux, initializes the model
  that.Tableau.sortInto = function(deck) {
    var i, // cards counter
        t, // tableau counter
        len = app.cards.CARDS_IN_DECK;
    
    that.dealing = true; // validation temporarily disabled
    that.init(); // set structures to initial states
    
    // i is card counter (0-51), t is tableau counter (0-7) within the TABLEAU_SET array
    for (i = 0, t = 0; i < len; ) { // Loop through all the shuffled cards
      if (this.place( deck[i], TABLEAU_SET[t] )) { i += 1; } // Card goes into tableaux, increment counter
      if (t === 7) { t = 0; } else { t++; } // 1st Tableau is TABLEAU_SET[0], last is TABLEAU_SET[7]
    }
    that.dealing = false; // reenable validation
  };
  
  //// Cells ////
  
  // Four cells at upper left, can each hold a single card
  that.Cells = { };
  that.Cells[CELL1] = EMPTY;
  that.Cells[CELL2] = EMPTY;
  that.Cells[CELL3] = EMPTY;
  that.Cells[CELL4] = EMPTY;
  // Place a card in a cell
  that.Cells.place = function( card, cell ) {
    if (that.isAllowed ( card, cell )) {  // valid move?
      that.remove( card, card.location ); // remove from old location
      this[cell] = card;                  // place card in this cell
      card.location = cell;               // note new location
      return OK;
    } else {
      return ILLEGAL;
    }
  };
  
  //// Foundations ////
    
  // Foundations which will hold the squared stacks of cards built by suit (Ace low) initially empty
  that.Foundations = { }
  that.Foundations[FOUNDATION1] = [ ];
  that.Foundations[FOUNDATION2] = [ ];
  that.Foundations[FOUNDATION3] = [ ];
  that.Foundations[FOUNDATION4] = [ ];
  that.Foundations.place = function (card, foundation) {
    if (that.isAllowed( card, foundation )) {
      that.remove( card, card.location );
      this[foundation].push(card);
      card.location = foundation;
      return OK;
    } else {
      return ILLEGAL;
    }
  };

  //// Removing Items ////
  
  // Removes the card from the old location. Always succeeds except removing from a Foundation.
  // The pattern is to first validate that the card may be placed from its
  // old location into a new one, then remove the card here, then add it to
  // the new location.
  that.remove = function( card, oldLocation ) {
    var oldTableauIndex,
        cardIndex;
    
    // Called whilst dealing, just scoot...
    if (oldLocation === IN_DECK) {
      return OK;
    }
    
    // Card in a cell? Remove it.
    if (CELL_SET.indexOf(oldLocation) !== -1) {
      that.Cells[oldLocation] = EMPTY;
      return OK;
    }
    
    // Card in a Tableau? Remove just that card from that tableau.
    oldTableauIndex = TABLEAU_SET.indexOf(oldLocation);
    if (oldTableauIndex !== -1) {
      cardIndex = that.Tableau[oldLocation].indexOf(card);
      if (cardIndex !== -1) {
        that.Tableau[oldLocation].removeItem(cardIndex);
        return OK;
      }
    }
    
    // Otherwise, removing from a Foundation. Disallowed.
    return ILLEGAL;
  };  
  
  //// Initialization ////
  
  // Initialize the model's data structures
  that.init = function() {
    that.Tableau[TABLEAU1] = [ ];
    that.Tableau[TABLEAU2] = [ ];
    that.Tableau[TABLEAU3] = [ ];
    that.Tableau[TABLEAU4] = [ ];
    that.Tableau[TABLEAU5] = [ ];
    that.Tableau[TABLEAU6] = [ ];
    that.Tableau[TABLEAU7] = [ ];
    that.Tableau[TABLEAU8] = [ ];
    that.Cells[CELL1] = EMPTY;
    that.Cells[CELL2] = EMPTY;
    that.Cells[CELL3] = EMPTY;
    that.Cells[CELL4] = EMPTY;    
    that.Foundations[FOUNDATION1] = [ ];
    that.Foundations[FOUNDATION2] = [ ];
    that.Foundations[FOUNDATION3] = [ ];
    that.Foundations[FOUNDATION4] = [ ];
  };
  
  //// Get Card ////
  
  // This may not be needed in the real game. Convenient for test page though.
  that.getCardAt = function (location) {
    switch (location) {
      case CELL1:
      case CELL2:
      case CELL3:
      case CELL4:
        return that.Cells[location]; // only card
        break;
      case FOUNDATION1:
      case FOUNDATION2:
      case FOUNDATION3:
      case FOUNDATION4:
        return that.Foundations[location][that.Foundations[location].length - 1]; // last card
        break;
      case TABLEAU1:
      case TABLEAU2:
      case TABLEAU3:
      case TABLEAU4:
      case TABLEAU5:
      case TABLEAU6:
      case TABLEAU7:
      case TABLEAU8:
        return that.Tableau[location][that.Tableau[location].length - 1]; // last card
        break;
    }
  };
  
  //// Game Rules ////
  
  // Compare ranks of two cards, return difference between them
  that.getDifferenceInRank = function (card1, card2) {
    var orderedRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
        card1Position = orderedRanks.indexOf(card1.rank),
        card2Position = orderedRanks.indexOf(card2.rank);
    return card1Position - card2Position;
  };
  
  // Rules engine logic to validates card movements
  that.isAllowed = function ( card, dest, extra ) {
    var cardUnder,
        rank1,
        rank2;
    
    // Make sure we have a real card
    if (!card) { return ILLEGAL; }
    
    // Destination: Cell rules
    if (CELL_SET.indexOf(dest) !== -1) {
      // The cell must be empty
      if (Cells[dest] !== EMPTY) { return ILLEGAL; }
      // You can't move a card from a foundation into a cell
      if (FOUNDATION_SET.indexOf(card.location) !== -1) { return ILLEGAL; }
      return OK;
    }
    
    // Destination: Tableau rules
    else if (TABLEAU_SET.indexOf(dest) !== -1) {
      if (that.dealing) { return OK; } // no fussy rules when dealing
      cardUnder = getCardAt(dest); // card, if any, showing on this tableau
      if (cardUnder === undefined) { return OK; } // no card there, go ahead
      if (cardUnder.suitColor === card.suitColor) { return ILLEGAL; } // red on black, black on red
      if (that.getDifferenceInRank(cardUnder, card) !== 1) { return ILLEGAL; }
      return OK;
    }
    
    // Destination: Foundation rules
    else if (FOUNDATION_SET.indexOf(dest) !== -1) {
      cardUnder = getCardAt(dest);
      if (cardUnder === undefined) {
        if (card.rank === 'A') { return OK; }
      } else {
        if (card.suit === cardUnder.suit) {
          if (that.getDifferenceInRank(cardUnder, card) === -1) { return OK; }
        }
      }
    }
    return ILLEGAL;
  };
  
  // Check for a safe automatic move. If found, returns from and to locations in an array,
  // If none found returns false.
  that.autoMove = function () {
    var i, // loop counters
        j,
        card,      // cards for comparison
        tempCard,
        tabsSet = that.TABLEAU_SET, // tableaus for evaluation
        tabsLen = tabsSet.length,
        cellSet = that.CELL_SET, // cells for evaluation
        cellLen = cellSet.length,
        foundSet = that.FOUNDATION_SET, // foundations for evaluation
        foundLen = foundSet.length,
        foundLowCard, // lowest ranking card in the foundations
        foundAnyTableauCard = false, // tests for win
        foundAnyCellCard = false;
          
    // If an ace is showing in a tableau, move it to the first free foundation
    for (i = 0; i < tabsLen; i++) {
      card = getCardAt(tabsSet[i]);
      if (card && card.rank === 'A') { // found an ace in the tableaux
        for (j = 0; j < foundLen; j++) {
          if (getCardAt(foundSet[j]) === undefined) {
            return [tabsSet[i], foundSet[j]]; // found an empty foundation, make the move
          }
        }
      }
    };
    
    // If we find the next card in suit for a foundation, add it only if
    // the card won't be more than one rank greater than the current lowest-ranking
    // card in all foundations.
    for (i = 0; i < foundLen; i++) {
      card = getCardAt(foundSet[i]);
      if (card !== undefined) {
        if (!foundLowCard) {
          foundLowCard = card;
        } else {
          foundLowCard = getDifferenceInRank(foundLowCard, card) > 0 ? card : foundLowCard;
        }
      }
    };
    
    // Loop through tableaux and cells to check for a card to move or a game winner
    for (i = 0; i < tabsLen; i++ ) {
      card = getCardAt(tabsSet[i]);
      if (card) {
        foundAnyTableauCard = true;
        if (getDifferenceInRank(foundLowCard, card) < -1) { // tableau card within rank range?
          continue;
        } else {
          for (j = 0; j < foundLen; j++) {
            tempCard = getCardAt(foundSet[j]);
            if (tempCard) {
              foundAnyTableauCard = true;
              if (tempCard.suit === card.suit) { // suits must match
                if (getDifferenceInRank(tempCard, card) === -1) { // can only place next card on foundation
                  return [tabsSet[i], foundSet[j]]; // a keeper, make the move
                }
              }
            }
          }
        }
      }
    }
    
    // If no playable cards are left, you've won.
    if (!foundAnyTableauCard && !foundAnyCellCard) {
      return that.WINNER;
    }
    
    return false;
  };
  
  //// Public members ////
  
  return {
    IN_DECK     : that.DECK,
    CELL1       : that.CELL1,
    CELL2       : that.CELL2,
    CELL3       : that.CELL3,
    CELL4       : that.CELL4,
    FOUNDATION1 : that.FOUNDATION1,
    FOUNDATION2 : that.FOUNDATION2,
    FOUNDATION3 : that.FOUNDATION3,
    FOUNDATION4 : that.FOUNDATION4,
    TABLEAU1    : that.TABLEAU1,
    TABLEAU2    : that.TABLEAU2,
    TABLEAU3    : that.TABLEAU3,
    TABLEAU4    : that.TABLEAU4,
    TABLEAU5    : that.TABLEAU5,
    TABLEAU6    : that.TABLEAU6,
    TABLEAU7    : that.TABLEAU7,
    TABLEAU8    : that.TABLEAU8,
    MOVING      : that.MOVING,
    EMPTY       : that.EMPTY,
    OK          : that.OK,
    ILLEGAL     : that.ILLEGAL,
    WINNER      : that.WINNER,
    Deck        : that.Deck,
    Cells       : that.Cells,
    Foundations : that.Foundations,
    Tableau      : that.Tableau,
    getCardAt   : that.getCardAt,
    autoMove    : that.autoMove
  }
  
})();

