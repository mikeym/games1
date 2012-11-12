// Playing Cards for MikeyCell, HTML5 Gameplay

var mikeycell = mikeycell || {};

// Playing card model that can return an ordered or shuffled deck.
mikeycell.cards = (function () {
  var that = this, // self reference for closures
      m = mikeycell;
      
  if (m.debug > m.NODEBUG) { console.log('cards'); }
  
  that.INITIAL_LOCATION = 0; // default initial location for cards ('IN_DECK')
  that.CARDS_IN_DECK = 52; // number of cards in our deck
  
  // Rank codes as keys return display names
  that.ranks = {
    'A' : 'Ace',
    '2' : '2',
    '3' : '3',
    '4' : '4',
    '5' : '5',
    '6' : '6',
    '7' : '7',
    '8' : '8',
    '9' : '9',
    '10': '10',
    'J' : 'Jack',
    'Q' : 'Queen',
    'K' : 'King'
  };
  
  // Suit codes as keys return arrays of suit-specific data
  // ['suitName', 'suitSymbol', 'suitColor'] in Card constructor
  that.suits = {
    'D' : ['Diamonds','♦','Red'],
    'S' : ['Spades','♠','Black'],
    'H' : ['Hearts','♥','Red'],
    'C' : ['Clubs','♣','Black']
  };
  
  // Card ids as keys return arrays of card-specific data
  // ['rank', 'suit']
  that.deck = {
    0 : [ 'A', 'D'], // Diamonds
    1 : [ '2', 'D'],
    2 : [ '3', 'D'],
    3 : [ '4', 'D'],
    4 : [ '5', 'D'],
    5 : [ '6', 'D'],
    6 : [ '7', 'D'],
    7 : [ '8', 'D'],
    8 : [ '9', 'D'],
    9 : ['10', 'D'],
   10 : [ 'J', 'D'],
   11 : [ 'Q', 'D'],
   12 : [ 'K', 'D'],
   13 : [ 'A', 'S'], // Spades
   14 : [ '2', 'S'],
   15 : [ '3', 'S'],
   16 : [ '4', 'S'],
   17 : [ '5', 'S'],
   18 : [ '6', 'S'],
   19 : [ '7', 'S'],
   20 : [ '8', 'S'],
   21 : [ '9', 'S'],
   22 : ['10', 'S'],
   23 : [ 'J', 'S'],
   24 : [ 'Q', 'S'],
   25 : [ 'K', 'S'],
   26 : [ 'A', 'H'], // Hearts
   27 : [ '2', 'H'],
   28 : [ '3', 'H'],
   29 : [ '4', 'H'],
   30 : [ '5', 'H'],
   31 : [ '6', 'H'],
   32 : [ '7', 'H'],
   33 : [ '8', 'H'],
   34 : [ '9', 'H'],
   35 : ['10', 'H'],
   36 : [ 'J', 'H'],
   37 : [ 'Q', 'H'],
   38 : [ 'K', 'H'],
   39 : [ 'A', 'C'], // Clubs
   40 : [ '2', 'C'],
   41 : [ '3', 'C'],
   42 : [ '4', 'C'],
   43 : [ '5', 'C'],
   44 : [ '6', 'C'],
   45 : [ '7', 'C'],
   46 : [ '8', 'C'],
   47 : [ '9', 'C'],
   48 : ['10', 'C'],
   49 : [ 'J', 'C'],
   50 : [ 'Q', 'C'],
   51 : [ 'K', 'C']
  };
  
  // Card object constructor
  // id is unique id of card from that.deck above
  // rank is the first element in the deck array
  // suit is the second element in the deck array
  // location is set to INITIAL_LOCATION for now
  that.Card = function (id, rank, suit, location) {
    this.id = id;                             // 0
    this.rank = rank;                         // 'A'
    this.suit = suit;                         // 'D'
    this.location = location;                 // INITIAL_LOCATION for now
    this.suitName = that.suits[suit][0];      // 'Diamonds'
    this.suitSymbol = that.suits[suit][1];    // ♦
    this.suitColor = that.suits[suit][2];     // 'Red'
    this.rankName = that.ranks[rank];         // 'Ace'
    this.rankAndSuit = this.rank + this.suit; // 'AD'
    this.getShortString = function() {
      return this.rank + this.suitSymbol;     // 4♠
    }
    this.getLongString = function() {
      return this.rankName + ' of ' + this.suitName; // 4 of Spades
    }
    // preloaded image for this card
    this.image = m.loader.getCardImage(this.rankAndSuit);
  };
  
  // Simple method to obtain a random integer based on the supplied number
  that.randomInteger = function (num) {
    return Math.floor( Math.random() * num );
  };
  
  // Shuffle and return the supplied array (of cards)
  // Random number seed for repeatable hands?
  that.shuffle = function (cardArray) {
    var rng = randomInteger,
        len = cardArray.length,
        i, r, tmp;

    if (m.debug === m.DEBUGALL) { console.log('cards.shuffle'); }

    for ( i = len - 1; i > 0; --i )
    {
      r = rng( i + 1 );
      if ( r !== i )
      {
        tmp = cardArray[ i ];
        cardArray[ i ] = cardArray[ r ];
        cardArray[ r ] = tmp;
      }
    }
  };
  
  // Returns a deck of cards, shuffled if shuffle is true, ordered if shuffle is false or omitted.
  that.newDeck = function (shuffle) {
    var returnDeck = [ ],
        i,
        td = that.deck,
        len = that.CARDS_IN_DECK;
  
    if (m.debug === m.DEBUGALL) { console.log('cards.newDeck: ' + shuffle); }

    // prepare an ordered deck of card objects  
    for (i = 0; i < len; i++) {
      returnDeck[i] = new that.Card(i, td[i][0], td[i][1], that.INITIAL_LOCATION);
    }
    
    // shuffle the deck if desired
    if (shuffle) {
      that.shuffle(returnDeck); 
    }
    return returnDeck;
  }
  
  // public members
  return {
    newDeck : that.newDeck,
    CARDS_IN_DECK : that.CARDS_IN_DECK
  }
  
})();