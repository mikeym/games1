// Game model for MikeyCell, for HTML5 Gameplay

// Array removeItem - By John Resig (MIT Licensed)
// Usage: myArray.remove(1); // removes second item from array
Array.prototype.removeItem = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

var mikeycell = mikeycell || {};

// The model
mikeycell.Model = (function () {
  var that = this, // Reference to app.model available within closures
      m = mikeycell;
  
  if (m.debug > m.NODEBUG) { console.log('Model'); }
    
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
  that.EMPTY = '';       // Cell, Foundation, Tableau etc is empty
  that.OK = true;
  that.ILLEGAL = false;  // Go Directly To Jail, Do Not Pass Go...  
  that.dealing = false;  // set to true when dealing cards, for validation bypass 
  that.hasWon = false,   // set to true after you've won
  that.moveAutomatically = true;  // Controls automatic moves to Foundations. May want to make a setting. 
  
  //// Locations ////
  
  // Convenience for debugging and character-based interim movement
  that.Location = { };
  
  // All numerical location constants in order
  that.Location.locConstants = [
    IN_DECK, 
    CELL1, CELL2, CELL3, CELL4, 
    FOUNDATION1, FOUNDATION2, FOUNDATION3, FOUNDATION4,
    TABLEAU1, TABLEAU2, TABLEAU3, TABLEAU4, TABLEAU5, TABLEAU6, TABLEAU7, TABLEAU8,
    MOVING    
  ];
  
  // All short location string codes in the same order as constants
  that.Location.locStringCodes = [
    'D',
    'C1', 'C2', 'C3', 'C4',
    'F1', 'F2', 'F3', 'F4',
    'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8',
    'M'
  ];
  
  // Return the short location string code corresponding to the supplied location constant
  that.Location.getShortString = function (loc) {
    return that.Location.locStringCodes[loc];
  };
  
  // Return the location constant corresponding to the supplied location string code
  that.Location.getLocationConstant = function (locStringCode) {
    return that.Location.locConstants[that.Location.locStringCodes.indexOf(locStringCode)];
  };
  
  //// Moving Cards ////
  
  // Array of card objects loaded when beginning a move, unloaded when placed
  that.Moving = { };
  that.Moving.Cards = [ ];
  
  // Place a moving card into the array
  that.addMovingCard = function (card) {
    that.Moving.Cards.push(card);
  }
  
  // Remove a card that is no longer moving from the array
  that.removeMovingCard = function (card) {
    var idx;
    if (that.Moving.Cards.length) {
      idx = that.Moving.Cards.indexOf(card);
      if (idx !== -1) {
        that.Moving.Cards.removeItem(idx);
      }
    }
  }
  
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
  
  // Sort a deck of cards into the tableaux, initializes the model
  that.Tableau.sortInto = function(deck) {
    var i = 0, // cards counter
        t = 0, // tableau counter
        len = mikeycell.cards.CARDS_IN_DECK;
    
    if (m.debug === m.DEBUGALL) { console.log('Model.Tableau.sortInto'); }
    
    that.init(); // set structures to initial states
  
    // recursive inner deal function with short delay between placements
    function loopDeal () {
      setTimeout( function () {
        that.dealing = true;                   // validation temporarily disabled
        putDown( deck[i], TABLEAU_SET[t] );    // place the card into the tableau
        that.dealing = false;                 // reenable validation
        i++;                                  // next card
        if (t === 7) { t = 0; } else { t++; }  // next tableau, or loop back to 1st
        if (i < len) {                        // if more cards, keep going
          loopDeal();
        } else {                              // when out of cards, look for exposed aces, etc
          setTimeout( autoMoveAndCheckForWin, 50); // help our player out a little 
        }
      }, 35); // delay between card placements
    }
    
    loopDeal(); // invoke above function initially  
  };
  
  
  //// Cells ////
  
  // Four cells at upper left, can each hold a single card
  that.Cells = { };
  that.Cells[CELL1] = EMPTY;
  that.Cells[CELL2] = EMPTY;
  that.Cells[CELL3] = EMPTY;
  that.Cells[CELL4] = EMPTY;
  
  // Gets the number of empty cells
  that.Cells.getNumberEmpty = function () {
    var i,
        numberFreeCells = 4;
    for (i = 0; i < 4; i++) {
      if (Cells[CELL_SET[i]] instanceof Card) {
        numberFreeCells -= 1;
      }
    }
    return numberFreeCells;
  };
  
  //// Foundations ////
    
  // Foundations which will hold the squared stacks of cards built by suit (Ace low) initially empty
  that.Foundations = { }
  that.Foundations[FOUNDATION1] = [ ];
  that.Foundations[FOUNDATION2] = [ ];
  that.Foundations[FOUNDATION3] = [ ];
  that.Foundations[FOUNDATION4] = [ ];
  
  //// Card movement ////
  
  // Returns OK if the supplied card may be picked up and moved someplace else, ILLEGAL if not
  that.canPickUp = function (card) {
    var numberOfEmptyCells,
        cardTableau,
        lastCardPos,
        prevMovingCard;
    
    if (m.debug === m.DEBUGALL) { console.log('Model.canPickUp: ' + card.getShortString()); }
    
    // called whilst dealing? fine
    if (card.location === IN_DECK) { return OK; }
    
    // called whilst moving? fine
    if (card.location === MOVING) { return OK; }

    // card in a cell? fine, can always put it back there again
    if (CELL_SET.indexOf(card.location) !== -1) { return OK; }
    
    // card in a tableau? follow the rules
    if (TABLEAU_SET.indexOf(card.location) !== -1) {
      
      // See if we're already moving a card
      if (Moving.Cards.length > 0){
        prevMovingCard = Moving.Cards[Moving.Cards.length - 1];
      }
            
      // See if this is the tableau's end card
      cardTableau = Tableau[card.location];
      lastCardPos = cardTableau.length - 1;
      
      if (cardTableau[lastCardPos] === card) {
        if (!prevMovingCard) {
          if (canPutDownAnywhere(card)) {
            return OK;
          } 
        }
      }
    }
    
    return ILLEGAL;
  };
  
  // Returns OK if the supplied card was picked up and removed from its current location, ILLEGAL otherwise
  that.pickUp = function (card) {
    if (m.debug === m.DEBUGALL) { console.log('Model.pickUp: ' + card.getShortString()); }

    if (canPickUp(card)) {
      
      // called whilst moving? fine
      if (card.location === MOVING) { return OK; }

      // Card in a cell? Remove it.
      if (CELL_SET.indexOf(card.location) !== -1) {
        that.Cells[card.location] = EMPTY;
        card.location = MOVING;
        addMovingCard(card);
        return OK;
      }
      
      // Card in a Tableau? Remove just that card from that tableau.
      oldTableauIndex = TABLEAU_SET.indexOf(card.location);
      if (oldTableauIndex !== -1) {
        cardIndex = that.Tableau[card.location].indexOf(card);
        if (cardIndex !== -1) {
          that.Tableau[card.location].removeItem(cardIndex);
          card.location = MOVING;
          addMovingCard(card);
          return OK;
        }
      }
      
    };
    
    // Otherwise, disallowed.
    return ILLEGAL;
  };
  
  // Tests to see if the supplied card may be safely placed in any location.
  that.canPutDownAnywhere = function (card) {
    var i;
    for (i = 0; i < CELL_SET.length; i++) {
      if (canPutDown(card, CELL_SET[i])) { return true; }
    }
    for (i = 0; i < FOUNDATION_SET.length; i++) {
      if (canPutDown(card, FOUNDATION_SET[i])) { return true; }
    }
    for (i = 0; i < TABLEAU_SET.length; i++) {
      if (canPutDown(card, TABLEAU_SET[i])) { return true; }
    }
    return false;
  };
  
  // Card placement rules - returns OK if card can be placed in the dest location, ILLEGAL otherwise
  that.canPutDown = function (card, dest) {
    var cardUnder,
        rank1,
        rank2;
        
    if (m.debug === m.DEBUGALL) { console.log('Model.canPutDown: ' + 
      card.getShortString() + ', ' + Location.getShortString(dest)); }

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
    
    // otherwise, nope
    return ILLEGAL;
  }
  
  // Places a card into the supplied destination. If permitted and successful, returns OK, otherwise ILLEGAL
  // Set the third arg to true to replace a card in its original location
  that.putDown = function ( card, dest, puttingCardBack ) {

    if (m.debug === m.DEBUGALL) { console.log('Model.putDown: ' + 
      card.getShortString() + ', ' + Location.getShortString(dest)); }
    
    if (canPutDown( card, dest ) || puttingCardBack) {
      
      if (CELL_SET.indexOf(dest) !== -1) {
        Cells[dest] = card;
        card.location = dest;
        removeMovingCard(card);
        if (!dealing) { 
          setTimeout(autoMoveAndCheckForWin, 50); 
        }
        return OK;
      }
      
      else if (TABLEAU_SET.indexOf(dest) !== -1) {
        Tableau[dest].push(card);
        card.location = dest;
        removeMovingCard(card);
        if (!dealing) { 
          setTimeout(autoMoveAndCheckForWin, 50); 
        }
        return OK;
      }
      
      else if (FOUNDATION_SET.indexOf(dest) !== -1) {
        Foundations[dest].push(card);
        card.location = dest;
        removeMovingCard(card);
        if (!dealing) { 
          setTimeout(autoMoveAndCheckForWin, 50); 
        }
        return OK;
      }
    }
    
    // otherwise, nope
    return ILLEGAL;
  };
  
  //// Initialization ////
  
  // Initialize the model's data structures
  that.init = function() {
    if (m.debug > m.DEBUGSOME) { console.log('Model.init'); }
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
    that.Moving.Cards = [ ];
    that.hasWon = false;
  };
  
  //// Get Card ////
  
  // This may not be needed in the real game. Convenient for test page though.
  that.getCardAt = function (location) {
    if (m.debug === m.DEBUGCRAZY) { console.log('Model.getCardAt: ' + Location.getShortString(location)); }

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
  
  // Compare ranks of two cards, return difference between them
  that.getDifferenceInRank = function (card1, card2) {
    var orderedRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
        card1Position = orderedRanks.indexOf(card1.rank),
        card2Position = orderedRanks.indexOf(card2.rank);
        
    if (m.debug === m.DEBUGCRAZY) { console.log('Model.getDifferenceInRank: ' + 
      card1.getShortString() + ', ' + card2.getShortString() +
      ' = ' + card1Position - card2Position); }

    return card1Position - card2Position;
  };
  
  
  // Checks for a safe automatic move. Also checks to see if we have a winner.
  // If the moveAutomatically setting is true, we make the move. 
  // This is pretty dreadful code, Mikey. 
  that.autoMoveAndCheckForWin = function () {
    var i, // loop counters
        j,
        card,                            // cards for comparison
        tempCard,
        tabsSet = that.TABLEAU_SET,     // tableaux for evaluation
        tabsLen = tabsSet.length,        // how many tableaux
        cellSet = that.CELL_SET,         // cells for evaluation
        cellLen = cellSet.length,        // how many cells
        foundSet = that.FOUNDATION_SET, // foundations for evaluation
        foundLen = foundSet.length,      // how many foundations
        foundLowCard,                   // lowest ranking card in the foundations
        foundAnyTableauCard = false,     // tests for win
        foundAnyCellCard = false,
        tc,                              // card we can pass to timeout
        tf;                              // foundation we can pass to timeout

          
    if (m.debug === m.DEBUGALL) { console.log('Model.autoMove...'); }

    // If an ace is showing in a tableau, move it to the first free foundation
    for (i = 0; i < tabsLen; i++) {
      card = getCardAt(tabsSet[i]);
      if (card && card.rank === 'A') { // found an ace in the tableaux
        for (j = 0; j < foundLen; j++) {
          if (getCardAt(foundSet[j]) === undefined) {
            // Have an empty foundation, if moving automatically place the ace there
            if (moveAutomatically && pickUp(card)) {
              // Gather card and empty foundation, place card there after short delay
              tc = card;
              tf = foundSet[j];
              setTimeout(function () {
                putDown(tc, tf);
              }, 35);
            }
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
        if (foundLowCard && getDifferenceInRank(foundLowCard, card) < -1) { // tableau card within rank range?
          continue;
        } else {
          for (j = 0; j < foundLen; j++) {
            tempCard = getCardAt(foundSet[j]);
            if (tempCard) {
              foundAnyTableauCard = true;
              if (tempCard.suit === card.suit) { // suits must match
                if (getDifferenceInRank(tempCard, card) === -1) { // can only place next card on foundation
                  if (moveAutomatically && pickUp(card)) {
                    // Gather card and empty foundation, place card there after short delay
                    tc = card;
                    tf = foundSet[j];
                    setTimeout(function () {
                      putDown(tc, tf);
                    }, 35);
                  }
                }
              }
            }
          }
        }
      }
    }
    
    // If no playable cards are left, you've won.
    if (!foundAnyTableauCard && !foundAnyCellCard) {
      that.hasWon = true;
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
    Location    : that.Location,
    Deck        : that.Deck,
    Cells       : that.Cells,
    Foundations : that.Foundations,
    Tableau     : that.Tableau,
    getCardAt   : that.getCardAt,
    autoMove    : that.autoMove,
    pickUp      : that.pickUp,
    putDown     : that.putDown,
    Moving      : that.Moving,
    hasWon      : that.hasWon
  }
  
})();

