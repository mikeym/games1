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
  that.CELL_SET = [that.CELL1, that.CELL2, that.CELL3, that.CELL4];
  that.FOUNDATION1 = 5;  // Leftmost foundation where cards are stacked Ace -> King
  that.FOUNDATION2 = 6;
  that.FOUNDATION3 = 7;
  that.FOUNDATION4 = 8;
  that.FOUNDATION_SET = [that.FOUNDATION1, that.FOUNDATION2, that.FOUNDATION3, that.FOUNDATION4];
  that.TABLEAU1 = 9;    // Leftmost tableau where cards are shuffled
  that.TABLEAU2 = 10;
  that.TABLEAU3 = 11;
  that.TABLEAU4 = 12;
  that.TABLEAU5 = 13;
  that.TABLEAU6 = 14;
  that.TABLEAU7 = 15;
  that.TABLEAU8 = 16;
  that.TABLEAU_SET = [that.TABLEAU1, that.TABLEAU2, that.TABLEAU3, that.TABLEAU4,
                      that.TABLEAU5, that.TABLEAU6, that.TABLEAU7, that.TABLEAU8];
  that.MOVING = 17;      // Card is being moved someplace
  that.EMPTY = '';       // Cell, Foundation, Tableau etc is empty
  that.OK = true;
  that.ILLEGAL = false;  // Go Directly To Jail, Do Not Pass Go...  
  that.dealing = false;  // set to true when dealing cards, for validation bypass 
  that.hasWon = false;   // set to true after you've won
  that.stopGame = false; // kill switch
  
  //// Locations ////
  
  // Convenience for debugging and character-based interim movement
  that.Location = { };
  
  // All numerical location constants in order
  that.Location.locConstants = [
    that.IN_DECK, 
    that.CELL1, that.CELL2, that.CELL3, that.CELL4, 
    that.FOUNDATION1, that.FOUNDATION2, that.FOUNDATION3, that.FOUNDATION4,
    that.TABLEAU1, that.TABLEAU2, that.TABLEAU3, that.TABLEAU4, 
    that.TABLEAU5, that.TABLEAU6, that.TABLEAU7, that.TABLEAU8,
    that.MOVING    
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
  };
  
  // Remove a card that is no longer moving from the array
  that.removeMovingCard = function (card) {
    var idx;
    if (that.Moving.Cards.length) {
      idx = that.Moving.Cards.indexOf(card);
      if (idx !== -1) {
        that.Moving.Cards.removeItem(idx);
      }
    }
  };
  
  //// Tableaux ////
  
  // Eight tableau at the bottom of the screen, cards fanned down
  that.Tableau = { };
  that.Tableau[that.TABLEAU1] = [ ];
  that.Tableau[that.TABLEAU2] = [ ];
  that.Tableau[that.TABLEAU3] = [ ];
  that.Tableau[that.TABLEAU4] = [ ];
  that.Tableau[that.TABLEAU5] = [ ];
  that.Tableau[that.TABLEAU6] = [ ];
  that.Tableau[that.TABLEAU7] = [ ];
  that.Tableau[that.TABLEAU8] = [ ];
  
  // Sort a deck of cards into the tableaux, initializes the model
  that.Tableau.sortInto = function(deck) {
    var i = 0, // cards counter
        t = 0, // tableau counter
        len = m.cards.CARDS_IN_DECK,
        settings = m.Settings,
        putCardDelayTime = settings.Delays.PutCard;
            
    if (m.debug === m.DEBUGALL) { console.log('Model.Tableau.sortInto'); }
    
    $('#newGameLink').attr('disabled', 'disabled'); // disable new game link
    
    that.initialize(); // set structures to initial states

    // recursive inner deal function with short delay between placements
    function loopDeal () {
    
      setTimeout( function () {
        if (that.stopGame) { return; }
        that.dealing = true;                          // validation temporarily disabled
        that.putDown( deck[i], that.TABLEAU_SET[t] ); // place the card into the tableau
        that.dealing = false;                         // reenable validation
        i++;                                          // next card
        if (t === 7) { t = 0; } else { t++; }         // next tableau, or loop back to 1st
        if (i < len ) {                               // if more cards, keep going
          loopDeal();
        } else {                                      // when out of cards, look for exposed aces, etc
          setTimeout( that.autoMoveAndCheckForWin,    // help player out a little
                      putCardDelayTime);              // delay times differ w or w/o sounds 
          setTimeout( function () {
            $('#newGameLink').removeAttr('disabled'); // reenable new game link
          }, putCardDelayTime);
        }
      }, putCardDelayTime); // delay between card placements
    }
    
    if (settings.getPlaySounds()) {
      m.Sounds.playSoundFor(m.Sounds.SHUFFLE);
    }
    setTimeout ( loopDeal, settings.Delays.Shuffle );
  };
  
  
  //// Cells ////
  
  // Four cells at upper left, can each hold a single card
  that.Cells = { };
  that.Cells[that.CELL1] = that.EMPTY;
  that.Cells[that.CELL2] = that.EMPTY;
  that.Cells[that.CELL3] = that.EMPTY;
  that.Cells[that.CELL4] = that.EMPTY;
  
  // Gets the number of empty cells
  that.Cells.getNumberEmpty = function () {
    var i,
        numberFreeCells = 4;
    for (i = 0; i < 4; i++) {
      if (that.Cells[that.CELL_SET[i]] instanceof m.Card) {
        numberFreeCells -= 1;
      }
    }
    return numberFreeCells;
  };
  
  //// Foundations ////
    
  // Foundations which will hold the squared stacks of cards built by suit (Ace low) initially empty
  that.Foundations = { };
  that.Foundations[that.FOUNDATION1] = [ ];
  that.Foundations[that.FOUNDATION2] = [ ];
  that.Foundations[that.FOUNDATION3] = [ ];
  that.Foundations[that.FOUNDATION4] = [ ];
  
  //// Initialization ////
  
  // Initialize the model's data structures
  that.initialize = function() {
    if (m.debug > m.DEBUGSOME) { console.log('Model.init'); }
    that.Tableau[that.TABLEAU1] = [ ];
    that.Tableau[that.TABLEAU2] = [ ];
    that.Tableau[that.TABLEAU3] = [ ];
    that.Tableau[that.TABLEAU4] = [ ];
    that.Tableau[that.TABLEAU5] = [ ];
    that.Tableau[that.TABLEAU6] = [ ];
    that.Tableau[that.TABLEAU7] = [ ];
    that.Tableau[that.TABLEAU8] = [ ];
    that.Cells[that.CELL1] = that.EMPTY;
    that.Cells[that.CELL2] = that.EMPTY;
    that.Cells[that.CELL3] = that.EMPTY;
    that.Cells[that.CELL4] = that.EMPTY;    
    that.Foundations[that.FOUNDATION1] = [ ];
    that.Foundations[that.FOUNDATION2] = [ ];
    that.Foundations[that.FOUNDATION3] = [ ];
    that.Foundations[that.FOUNDATION4] = [ ];
    that.Moving.Cards = [ ];
    that.hasWon = false;
    that.stopGame = false;
  };
  
  //// Card movement ////
  
  // Returns OK if the supplied card may be picked up and moved someplace else, ILLEGAL if not
  that.canPickUp = function (card) {
    var cardTableau,
        lastCardPos,
        prevMovingCard;
    
    if (m.debug === m.DEBUGALL) { console.log('Model.canPickUp: ' + card.getShortString()); }
    
    // called whilst dealing? fine
    if (card.location === that.IN_DECK) { return that.OK; }
    
    // called whilst moving? fine
    if (card.location === that.MOVING) { return that.OK; }

    // card in a cell? fine, can always put it back there again
    if (that.CELL_SET.indexOf(card.location) !== -1) { return that.OK; }
    
    // card in a tableau? follow the rules
    if (that.TABLEAU_SET.indexOf(card.location) !== -1) {
      
      // See if we're already moving a card
      if (that.Moving.Cards.length > 0){
        prevMovingCard = that.Moving.Cards[that.Moving.Cards.length - 1];
      }
            
      // See if this is the tableau's end card
      cardTableau = that.Tableau[card.location];
      lastCardPos = cardTableau.length - 1;
      
      if (cardTableau[lastCardPos] === card) {
        if (!prevMovingCard) {
          if (that.canPutDownAnywhere(card)) {
            return that.OK;
          } 
        }
      }
    }
    
    return that.ILLEGAL;
  };
  
  // Returns OK if the supplied card was picked up and removed from its current location, ILLEGAL otherwise
  that.pickUp = function (card) {
    var oldTableauIndex,
        cardIndex;
    
    if (m.debug === m.DEBUGALL) { console.log('Model.pickUp: ' + card.getShortString()); }

    if (that.canPickUp(card)) {
      
      // called whilst moving? fine
      if (card.location === that.MOVING) { return that.OK; }

      // Card in a cell? Remove it.
      if (that.CELL_SET.indexOf(card.location) !== -1) {
        that.Cells[card.location] = that.EMPTY;
        card.location = that.MOVING;
        that.addMovingCard(card);
        return that.OK;
      }
      
      // Card in a Tableau? Remove just that card from that tableau.
      oldTableauIndex = that.TABLEAU_SET.indexOf(card.location);
      if (oldTableauIndex !== -1) {
        cardIndex = that.Tableau[card.location].indexOf(card);
        if (cardIndex !== -1) {
          that.Tableau[card.location].removeItem(cardIndex);
          card.location = that.MOVING;
          that.addMovingCard(card);
          return that.OK;
        }
      }
      
    }
    
    // Otherwise, disallowed.
    return that.ILLEGAL;
  };
  
  // Tests to see if the supplied card may be safely placed in any location.
  that.canPutDownAnywhere = function (card) {
    var i;
    for (i = 0; i < that.CELL_SET.length; i++) {
      if (that.canPutDown(card, that.CELL_SET[i])) { return true; }
    }
    for (i = 0; i < that.FOUNDATION_SET.length; i++) {
      if (that.canPutDown(card, that.FOUNDATION_SET[i])) { return true; }
    }
    for (i = 0; i < that.TABLEAU_SET.length; i++) {
      if (that.canPutDown(card, that.TABLEAU_SET[i])) { return true; }
    }
    return false;
  };
  
  // Card placement rules - returns OK if card can be placed in the dest location, ILLEGAL otherwise
  that.canPutDown = function (card, dest) {
    var cardUnder;
        
    if (m.debug === m.DEBUGALL) { console.log('Model.canPutDown: ' + 
      card.getShortString() + ', ' + that.Location.getShortString(dest)); }

    // Destination: Cell rules
    if (that.CELL_SET.indexOf(dest) !== -1) {
      // The cell must be empty
      if (that.Cells[dest] !== that.EMPTY) { return that.ILLEGAL; }
      // You can't move a card from a foundation into a cell
      if (that.FOUNDATION_SET.indexOf(card.location) !== -1) { return that.ILLEGAL; }
      return that.OK;
    }
    
    // Destination: Tableau rules
    else if (that.TABLEAU_SET.indexOf(dest) !== -1) {
      if (that.dealing) { return that.OK; } // no fussy rules when dealing
      cardUnder = that.getCardAt(dest); // card, if any, showing on this tableau
      if (cardUnder === undefined) { return that.OK; } // no card there, go ahead
      if (cardUnder.suitColor === card.suitColor) { return that.ILLEGAL; } // red on black, black on red
      if (that.getDifferenceInRank(cardUnder, card) !== 1) { return that.ILLEGAL; }
      return that.OK;
    }
    
    // Destination: Foundation rules
    else if (that.FOUNDATION_SET.indexOf(dest) !== -1) {
      cardUnder = that.getCardAt(dest);
      if (cardUnder === undefined) {
        if (card.rank === 'A') { return that.OK; }
      } else {
        if (card.suit === cardUnder.suit) {
          if (that.getDifferenceInRank(cardUnder, card) === -1) { return that.OK; }
        }
      }
    }
    
    // otherwise, nope
    return that.ILLEGAL;
  };
  
  // Places a card into the supplied destination. If permitted and successful, returns OK, otherwise ILLEGAL
  // Set the third arg to true to replace a card in its original location
  that.putDown = function ( card, dest, puttingCardBack ) {
    var settings = m.Settings,
        playSounds = settings.getPlaySounds(),
        autoMoveDelayTime = settings.Delays.AutoMove;

    if (m.debug === m.DEBUGALL) { console.log('Model.putDown: ' + 
      card.getShortString() + ', ' + that.Location.getShortString(dest)); }
      
    if (that.stopGame) { return that.ILLEGAL; }
    
    if (that.canPutDown( card, dest ) || puttingCardBack) {
      
      if (that.CELL_SET.indexOf(dest) !== -1) {
        that.Cells[dest] = card;
        card.location = dest;
        // Play appropriate sound
        if (playSounds) {
          if (puttingCardBack) {
            m.Sounds.playSoundFor(m.Sounds.ERROR);
          } else {
            m.Sounds.playSoundFor(m.Sounds.PUTCARD);
          }
        }
        that.removeMovingCard(card);
        if (!that.dealing) { 
          setTimeout(that.autoMoveAndCheckForWin, autoMoveDelayTime); 
        }
        return that.OK;
      }
      
      else if (that.TABLEAU_SET.indexOf(dest) !== -1) {
        that.Tableau[dest].push(card);
        card.location = dest;
        // Play appropriate sound
        if (playSounds) {
          if (puttingCardBack) {
            m.Sounds.playSoundFor(m.Sounds.ERROR);
          } else {
            m.Sounds.playSoundFor(m.Sounds.PUTCARD);
          }
        }
        that.removeMovingCard(card);
        if (!that.dealing) { 
          setTimeout(that.autoMoveAndCheckForWin, autoMoveDelayTime); 
        }
        return that.OK;
      }
      
      else if (that.FOUNDATION_SET.indexOf(dest) !== -1) {
        that.Foundations[dest].push(card);
        card.location = dest;
        // Play appropriate sound
        if (playSounds) {
          if (puttingCardBack) {
            m.Sounds.playSoundFor(m.Sounds.ERROR);
          } else {
            m.Sounds.playSoundFor(m.Sounds.PUTCARD);
          }
        }
        that.removeMovingCard(card);
        if (!that.dealing) { 
          setTimeout(that.autoMoveAndCheckForWin, autoMoveDelayTime); 
        }
        return that.OK;
      }
    }
    
    // otherwise, nope
    return that.ILLEGAL;
  };
  
  //// Get Card ////
  
  // This may not be needed in the real game. Convenient for test page though.
  that.getCardAt = function (location) {
    if (m.debug === m.DEBUGCRAZY) { console.log('Model.getCardAt: ' + that.Location.getShortString(location)); }

    switch (location) {
      case that.CELL1:
      case that.CELL2:
      case that.CELL3:
      case that.CELL4:
        return that.Cells[location]; // only card
        break;
      case that.FOUNDATION1:
      case that.FOUNDATION2:
      case that.FOUNDATION3:
      case that.FOUNDATION4:
        return that.Foundations[location][that.Foundations[location].length - 1]; // last card
        break;
      case that.TABLEAU1:
      case that.TABLEAU2:
      case that.TABLEAU3:
      case that.TABLEAU4:
      case that.TABLEAU5:
      case that.TABLEAU6:
      case that.TABLEAU7:
      case that.TABLEAU8:
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
        card,                           // cards for comparison
        tempCard,
        cellSet = that.CELL_SET,        // cells for evaluation
        cellLen = cellSet.length,       
        tabsSet = that.TABLEAU_SET,     // tableaux for evaluation
        tabsLen = tabsSet.length,
        foundSet = that.FOUNDATION_SET, // foundations for evaluation
        foundLen = foundSet.length,     // how many foundations
        foundLowCard,                   // lowest ranking card in the foundations
        foundAnyTableauCard = false,    // tests for win
        foundAnyCellCard = false,
        autoMovingACard = false,        // only move one please
        tc,                             // card we can pass to timeout
        tf,                             // foundation we can pass to timeout
        putCardDelayTime = m.Settings.Delays.PutCard, // variable delays for sound on/off
        winDelayTime = m.Settings.Delays.Win,
        moveAutomatically = m.Settings.getAutoMove(); // auto-place card in foundation

          
    if (m.debug === m.DEBUGALL) { console.log('Model.autoMove...'); }
    
    if (that.stopGame) { return false; }
    
    // If an ace is showing in a tableau, move it to the first free foundation
    for (i = 0; i < tabsLen; i++) {
      card = that.getCardAt(tabsSet[i]);
      if (card && card.rank === 'A') { // found an ace in the tableaux
        for (j = 0; j < foundLen; j++) {
          if (that.getCardAt(foundSet[j]) === undefined) {
            // Have an empty foundation, if moving automatically place the ace there
            if (moveAutomatically && that.pickUp(card)) {
              // Gather card and empty foundation, place card there after short delay
              tc = card;
              tf = foundSet[j];
              autoMovingACard = true;
              setTimeout(function () {
                that.putDown(tc, tf);
              }, putCardDelayTime);
            }
          }
        }
      }
    }
    
    // If we find the next card in suit for a foundation, add it only if
    // the card won't be more than one rank greater than the current lowest-ranking
    // card in all foundations. 
    for (i = 0; i < foundLen; i++) {
      card = that.getCardAt(foundSet[i]);
      if (card !== undefined) {
        if (!foundLowCard) {
          foundLowCard = card;
        } else {
          foundLowCard = that.getDifferenceInRank(foundLowCard, card) > 0 ? card : foundLowCard;
        }
      }
    }
    
    // Loop through tableaux to check for a card to move or a game winner
    for (i = 0; i < tabsLen; i++ ) {
      card = that.getCardAt(tabsSet[i]);
      if (card) {
        foundAnyTableauCard = true;
        if (foundLowCard && that.getDifferenceInRank(foundLowCard, card) < -1) { // tableau card within rank range?
          continue;
        } else {
          for (j = 0; j < foundLen; j++) {
            tempCard = that.getCardAt(foundSet[j]);
            if (tempCard) {
              foundAnyTableauCard = true;
              if (tempCard.suit === card.suit) { // suits must match
                if (that.getDifferenceInRank(tempCard, card) === -1) { // can only place next card on foundation
                  if (moveAutomatically && that.pickUp(card)) {
                    // Gather card and empty foundation, place card there after short delay
                    tc = card;
                    tf = foundSet[j];
                    autoMovingACard = true;
                    setTimeout(function () {
                      that.putDown(tc, tf);
                    }, putCardDelayTime);
                  }
                }
              }
            }
          }
        }
      }
    }
    
    // loop through cells to check for a game winner, or a card to move if we're not moving something else
    for (i = 0; i < cellLen; i++) {
      card = that.getCardAt(cellSet[i]);
      if (card) {
        foundAnyCellCard = true;
        if (foundLowCard && that.getDifferenceInRank(foundLowCard, card) < -1) {
          continue;
        } else if (autoMovingACard) {
          continue;
        } else {
          for (j = 0; j < foundLen; j++) {
            tempCard = that.getCardAt(foundSet[j]);
            if (tempCard) {
              if (tempCard.suit === card.suit) { // suits must match
                if (that.getDifferenceInRank(tempCard, card) === -1) { // can only place next card on foundation
                  if (moveAutomatically && that.pickUp(card)) {
                    // Gather card and empty foundation, place card there after short delay
                    tc = card;
                    tf = foundSet[j];
                    setTimeout(function () {
                      that.putDown(tc, tf);
                    }, putCardDelayTime);
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
      if (m.Settings.getPlaySounds()) {
        m.Sounds.playSoundFor(m.Sounds.WIN);
      }
      setTimeout(function() { 
        return false; 
      }, winDelayTime); // time for a bit of applause
    } else {
      return false; // no delay
    }
  };
  
  // Stops game to avoid double-dealing bug
  that.stopGameNow = function () {
    that.stopGame = true;
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
    Location    : that.Location,
    Deck        : that.Deck,
    Cells       : that.Cells,
    Foundations : that.Foundations,
    Tableau     : that.Tableau,
    getCardAt   : that.getCardAt,
    pickUp      : that.pickUp,
    putDown     : that.putDown,
    Moving      : that.Moving,
    hasWon      : that.hasWon,
    stopGameNow : that.stopGameNow
  };
  
})();

