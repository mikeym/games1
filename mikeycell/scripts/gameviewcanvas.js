// MikeyCell canvas game view
// Michael Micheletti HTML5 Gameplay homework project

// Global game object
var mikeycell = mikeycell || { };

mikeycell.view = (function() {
  var that = this,
      c = mikeycell.cards,
      m = mikeycell.Model,
      l = mikeycell.loader,
      d = mikeycell,
      
      ctx, // context at the module level, assigned when new game started
      numCards = c.CARDS_IN_DECK,
      
      // essentially a 1-based array (tabs[1] = m.TABLEAU1)
      tabs = [0, m.TABLEAU1, m.TABLEAU2, m.TABLEAU3, m.TABLEAU4, 
              m.TABLEAU5, m.TABLEAU6, m.TABLEAU7, m.TABLEAU8],
      
      // another 1-based array for clearing tableau backgrounds, set when tableaus are refreshed        
      tabsBottomY = [0, 0, 0, 0, 0, 0, 0, 0, 0], 
      
      // measurement constants, which are not really constant anymore since we tweak 'em
      DEFAULT_LARGE_WIDTH = 1014,
      DEFAULT_LARGE_HEIGHT = 700,
      
      // Column x positions individually, and in another 1-based array
      COL1X = 20,   // Metrics based on default 1014x700 pixel large size
      COL2X = 143,
      COL3X = 266,
      COL4X = 389,
      COL5X = 512,
      COL6X = 635,
      COL7X = 758,
      COL8X = 881,
      COL_n_X = [0, COL1X, COL2X, COL3X, COL4X, COL5X, COL6X, COL7X, COL8X],
      
      // Other pixel-based constants
      TOPY = 35,  // card y positions for cells and foundations
      TABLEAUY = 210, // top card y position for tableau
      CARDWIDTH = 113, // card width 
      CARDHEIGHT = 157, // card height
      CARDYOFFSET = 26, // for casades in tableau
      CARDRADIUS = 7, // corner radius
      
      // colors
      CELLBKGDCOLOR = "#3A5E21",
      FOUNDBKGDCOLOR = "#4C7B2C",
      CARDSHADOWCOLOR = "#16240D",
      TABLEAUBKGDCOLOR = "";
      
  if (d.debug > d.NODEBUG) { console.log('view'); }
  
  // Sets game metrics based on the size of the canvas, which is sized based on it's container.
  // The default large size is 1014 x 700. This is called for a new game or when the window is resized.
  function setMetrics() {
    var width = ctx.canvas.width,
        height = ctx.canvas.height,
        reductionFactor = width / DEFAULT_LARGE_WIDTH;
        
        COL1X = 20 * reductionFactor;
        COL2X = 143 * reductionFactor;
        COL3X = 266 * reductionFactor;
        COL4X = 389 * reductionFactor;
        COL5X = 512 * reductionFactor;
        COL6X = 635 * reductionFactor;
        COL7X = 758 * reductionFactor;
        COL8X = 881 * reductionFactor;
        COL_n_X = [0, COL1X, COL2X, COL3X, COL4X, COL5X, COL6X, COL7X, COL8X];
        TOPY = 35 * reductionFactor;
        TABLEAUY = 210 * reductionFactor;
        CARDWIDTH = 113 * reductionFactor;
        CARDHEIGHT = 157 * reductionFactor;
        CARDYOFFSET = 26 * reductionFactor;
        CARDRADIUS = 7 * reductionFactor;
  }
  
  //// Game play view methods ////

  // Shuffle the cards, lay them out, and start the game.
  function newGame($canvasBox) {
    var $canvas = $('<canvas id="gameCanvas">MikeyCell</canvas>')[0],
        width = $canvas.width = $canvasBox.width(), // as wide as container
        height = $canvas.height = $canvasBox.height(); // as tall as container
        
    if (d.debug > d.NODEBUG) { console.log('view.newGame'); }

    // create canvas and get its context
    $($canvasBox).html($canvas);
    ctx = $canvas.getContext('2d');
    
    // Responsive sizes set
    setMetrics();
    
    paintCellAndFoundationBkgds();

    // shadows for cards
    ctx.shadowColor = CARDSHADOWCOLOR;
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 2;

    // Get a new sorted deck and refresh the tableaux
    m.Deck = c.newDeck(true); // shuffled
    m.Tableau.sortInto(m.Deck);
    
    // hide address bar on mobile if needed after dealing into tableau
    window.scrollTo(0,1); 
    
//    // TEMPORARY TESTING FUN AUTOMATIC VICTORY HOORAY
//    var k = m.Deck = c.newDeck();
//    var a = [
//    k[12], k[6], k[25], k[19], k[38], k[32], k[51], k[45],
//    k[11], k[5], k[24], k[18], k[37], k[31], k[50], k[44],
//    k[10], k[4], k[23], k[17], k[36], k[30], k[49], k[43],
//    k[9],  k[3], k[22], k[16], k[35], k[29], k[48], k[42],
//    k[8],  k[2], k[21], k[15], k[34], k[28], k[47], k[41],
//    k[7],  k[1], k[20], k[14], k[33], k[27], k[46], k[40],
//    k[0],  k[13], k[26], k[39]
//    ];
//    m.Tableau.sortInto(a);
    
  };
  
  // Brute force method refreshes all tableau, cell and foundation displays, called externally by loop
  function refreshDisplay() {
    if (d.debug === d.DEBUGCRAZY) { console.log('view.refreshDisplay'); }
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clear everything
    
    paintCellAndFoundationBkgds(); // paint bkgds
    
    refreshCellDisplay(m.CELL1); // paint cards
    refreshCellDisplay(m.CELL2);
    refreshCellDisplay(m.CELL3);
    refreshCellDisplay(m.CELL4);
    
    refreshTableauDisplay(1); // indexes to this object's tabs array, awkward yes
    refreshTableauDisplay(2);
    refreshTableauDisplay(3);
    refreshTableauDisplay(4);
    refreshTableauDisplay(5);
    refreshTableauDisplay(6);
    refreshTableauDisplay(7);
    refreshTableauDisplay(8);
    
    refreshFoundation(m.FOUNDATION1);
    refreshFoundation(m.FOUNDATION2);
    refreshFoundation(m.FOUNDATION3);
    refreshFoundation(m.FOUNDATION4);
    
    refreshMovingCards(); // paint any moving card

    if (hasWon) {
      congratulateTheWinner();
    }
    
  };
  
  // Gaudy display upon winning the game in lieu of a free iPad or something cool.
  function congratulateTheWinner() {
    var congratsText = "Congratulations!",
        width = ctx.canvas.width,            // as wide as container
        height = ctx.canvas.height,          // as tall as container
        centerX = width / 2,                 // X-axis center
        centerY = height - (height * .1),    // Y-axis center
        angle = Math.PI * 0.6,               // angle of arc
        radius = height / 1.4,               // again, looks right
        fontSizePixels = height / 7.5,       // seems about right for the arc text
        linkTextWidth,                       // will be computed for underline
        fillColors = ["#8C3B1D", "#C95D37"]; // darker and lighter colors, see mikeycell.css for palette
    
    ctx.save();
    
    ctx.font = "" + fontSizePixels + "px cboxregular";
    ctx.textAlign = "center";
    ctx.fillStyle = width > 700 ? fillColors[0] : fillColors[1];
    ctx.shadowColor = "#08111C";
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    // Arc 'Congratulations!'
    ctx.save();
    ctx.translate(centerX, centerY + (centerY / 4));
    ctx.rotate( -1 * angle / 2.09 );
    ctx.rotate( -1 * (angle / congratsText.length) / 2 );
    for (i = 0; i <  congratsText.length; i++) {
      ctx.rotate(angle / congratsText.length);
      ctx.save();
      ctx.translate(0, -1 * radius);
      ctx.fillText(congratsText[i], 0, 0);
      ctx.restore();
    }
    ctx.restore();
    
    // Other text and underline
    ctx.save();
    ctx.font = "" + fontSizePixels * .75 + "px cboxregular";
    ctx.fillText("You've Won!", ctx.canvas.width / 2, ctx.canvas.height * .70);
    ctx.font = "" + fontSizePixels * .35 + "px cboxregular";
    ctx.fillText("Play Again?", ctx.canvas.width / 2, ctx.canvas.height * .78);
    linkTextWidth = textWidth = ctx.measureText("Play Again?").width;

    ctx.beginPath();
    ctx.strokeStyle = width > 700 ? fillColors[0] : fillColors[1];
    ctx.lineWidth = 2;
    ctx.moveTo( (ctx.canvas.width / 2) - (linkTextWidth / 2), ctx.canvas.height * .79);
    ctx.lineTo( (ctx.canvas.width / 2) + (linkTextWidth / 2), ctx.canvas.height * .79);
    ctx.stroke();
    ctx.restore();
    
    ctx.restore();
  };

  // Refresh display of a specific tableau after shuffle or move
  function refreshTableauDisplay(tabNumber) {
    var i,
        theTableau,
        theCard;
        
    if (d.debug === d.DEBUGCRAZY) { console.log('view.refreshTableauDisplay: ' + tabNumber); }
    
    for (i = 0; i < m.Tableau[tabs[tabNumber]].length; i++) {
        theTableau = m.Tableau[tabs[tabNumber]];
        theCard = theTableau[i];
        // draws a card in this tableau's column, cascaded down from it's predecessor
        ctx.drawImage(theCard.image, 
                      COL_n_X[tabNumber], 
                      TABLEAUY + (i * CARDYOFFSET), 
                      CARDWIDTH, 
                      CARDHEIGHT);
                      
        theCard.cardX = COL_n_X[tabNumber];
        theCard.cardY = TABLEAUY + (i * CARDYOFFSET);
                      
        // set the lower Y boundary of this tableau for later clearing
        tabsBottomY[tabNumber] = TABLEAUY + (i * CARDYOFFSET) + CARDHEIGHT;
    }
  };
  
  // Refreshes one of the cells
  function refreshCellDisplay(cellNumber) {
    var theCard;
    
    if (d.debug === d.DEBUGCRAZY) { console.log('view.refreshCellDisplay: ' + cellNumber); }

    theCard = m.Cells[cellNumber]; // 1 - 4
    if (theCard) {
      // draw the card in the cell
      ctx.drawImage(theCard.image,
                    COL_n_X[cellNumber],
                    TOPY,
                    CARDWIDTH,
                    CARDHEIGHT);

      theCard.cardX = COL_n_X[cellNumber];
      theCard.cardY = TOPY;
    } 
  };
  
  // Refreshes one of the foundations
  function refreshFoundation(foundationNumber) {
    var theCard,
        f = m.Foundations[foundationNumber]; // 5 - 8
    
    if (d.debug === d.DEBUGCRAZY) { console.log('view.refreshFoundationDisplay: ' + foundationNumber); }

    theCard = f[f.length - 1]; // just draw the last card
    if (theCard) {
      // draw the card in the foundation
      ctx.drawImage(theCard.image,
                    COL_n_X[foundationNumber],
                    TOPY,
                    CARDWIDTH,
                    CARDHEIGHT);
                    
      theCard.cardX = COL_n_X[foundationNumber];
      theCard.cardY = TOPY;
    } 
  };
    
  // Paints the lighter cells and foundations above the tableaux.
  function paintCellAndFoundationBkgds() {
    if (d.debug === d.DEBUGCRAZY) { console.log('view.paintCellAndFoundationBkgds'); }

    ctx.save();
    // cells
    ctx.fillStyle = CELLBKGDCOLOR;
    fillRoundedRect(COL1X, TOPY, CARDWIDTH, CARDHEIGHT, CARDRADIUS);
    fillRoundedRect(COL2X, TOPY, CARDWIDTH, CARDHEIGHT, CARDRADIUS);
    fillRoundedRect(COL3X, TOPY, CARDWIDTH, CARDHEIGHT, CARDRADIUS);
    fillRoundedRect(COL4X, TOPY, CARDWIDTH, CARDHEIGHT, CARDRADIUS);
    
    // foundations
    ctx.fillStyle = FOUNDBKGDCOLOR;
    fillRoundedRect(COL5X, TOPY, CARDWIDTH, CARDHEIGHT, CARDRADIUS);
    fillRoundedRect(COL6X, TOPY, CARDWIDTH, CARDHEIGHT, CARDRADIUS);
    fillRoundedRect(COL7X, TOPY, CARDWIDTH, CARDHEIGHT, CARDRADIUS);
    fillRoundedRect(COL8X, TOPY, CARDWIDTH, CARDHEIGHT, CARDRADIUS);
    
    ctx.restore();
  };
  
  // If we're moving a card, refresh the display
   function refreshMovingCards() {
    var i,
        card;
        
    if (d.debug === d.DEBUGCRAZY) { console.log('view.refreshMovingCards'); }
    
    // Draw any moving cards in their various locations
    for (i = 0; i < m.Moving.Cards.length; i++) {
        card = m.Moving.Cards[i];
        
        ctx.save();
        
        // longer shadows for moving cards
        ctx.shadowColor = CARDSHADOWCOLOR;
        ctx.shadowBlur = 9;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        
        // draw the card in its new position
        ctx.drawImage(card.image,
                      card.cardX,
                      card.cardY,
                      CARDWIDTH,
                      CARDHEIGHT);
        
        ctx.restore();
    }
  };
   
  //// Input translation methods ////
  
  function moveCards(e) {
    var canvasRect,   // canvas bounding rectangle
        canvasX,      // mouse X converted to canvas X
        canvasY,      // mouse Y converted to canvas Y
        i,            // loop
        card;          // card in loop

    if (d.debug === d.DEBUGCRAZY) { console.log('view.moveCard: ' + card.rankAndSuit + ' ' + e); }
    
    // get canvas coordinates from mouse coordinates    
    canvasRect = ctx.canvas.getBoundingClientRect();
    if (e.changedTouches) {
      canvasX = e.changedTouches[0].pageX - canvasRect.left;
      canvasY = e.changedTouches[0].pageY - canvasRect.top;
    } else {
       canvasX = e.clientX - canvasRect.left;
       canvasY = e.clientY - canvasRect.top;
    }
    
    // Set new moving card position property values
    for (i = 0; i < m.Moving.Cards.length; i++) {
      card = m.Moving.Cards[i];
      card.cardX = canvasX - card.offsetX;
      card.cardY = canvasY - card.offsetY;
    }
  };
  
  // Given a mouse event, returns the card object at the event's
  // position along with the card image's X & Y locations.
  // Returns null if there's not a card there. We use this on a
  // mousedown event, to see if we can move the selected card.
  function getCardAtEventPosition(e) {
    var i,            // loop counters
        j,
        card,          // card at location
        canvasRect,    // canvas bounding rectangle
        canvasX,      // mouse X converted to canvas X
        canvasY,      // mouse Y converted to canvas Y
        theTableau;    // tableau selected in loop
        
    if (d.debug === d.DEBUGCRAZY) { console.log('view.getCardAtEventPosition: ' + e); }
    
    // get canvas coordinates from mouse coordinates    
    canvasRect = ctx.canvas.getBoundingClientRect();
    if (e.changedTouches) {
      canvasX = e.changedTouches[0].pageX - canvasRect.left;
      canvasY = e.changedTouches[0].pageY - canvasRect.top;
    } else {
       canvasX = e.clientX - canvasRect.left;
       canvasY = e.clientY - canvasRect.top;
    }
    
    ctx.save(); // save current context
    
    // Test if we've clicked in one of the four cells. 
    for (i = m.CELL1; i < m.CELL4 + 1; i++) {
      
      // Create a rectangle path at the cell location
      ctx.beginPath();
      ctx.rect(COL_n_X[i], TOPY, CARDWIDTH, CARDHEIGHT);
      
      // Test if our click point is within the rectangle path
      if (ctx.isPointInPath(canvasX, canvasY)) {
        
        // If we've clicked in this cell, return the card there or null
        card = m.Cells[i];
        if (d.debug === d.DEBUGALL) { 
          console.log('view.getCardAtEventPosition: Cell' + i + ' ' + 
          card ? card.rankAndSuit : card); 
        }
        
        // We have a card to move, add new movement properties
        if (card) {
          card.cardX = COL_n_X[i];
          card.cardY = TOPY;
          card.offsetX = canvasX - card.cardX;
          card.offsetY = canvasY - card.cardY;
          ctx.restore();
          return card;
        }
      }
    }
    
    // Test if we've clicked in one of the eight tableaux.
    // Test each card in each tableau starting from the end, to get the one on top.
    for (i = 1; i < tabs.length; i++) {
      theTableau = m.Tableau[tabs[i]];
      
      // loop through cards in tableau from the end
      for (j = theTableau.length - 1; j >= 0; j--) {

        // draw a rectangle at this position
        ctx.beginPath();
        ctx.rect(COL_n_X[i], TABLEAUY + (j * CARDYOFFSET), CARDWIDTH, CARDHEIGHT);
        
        // Test if mouse click was at this card in this tableau
        if (ctx.isPointInPath(canvasX, canvasY)) {
          card = theTableau[j];
          if (d.debug === d.DEBUGALL) { 
            console.log('view.getCardAtEventPosition: Tableau' + i + ' ' + 
            card ? card.rankAndSuit : card); 
          }
          
          // we have a card to move, add new movement properties
          if (card) {
            card.cardX = COL_n_X[i];
            card.cardY = TABLEAUY + (j * CARDYOFFSET);
            card.offsetX = canvasX - card.cardX;
            card.offsetY = canvasY - card.cardY;
            ctx.restore();
            return card;
          }        
        }        
      }
    }
    
    // Not found
    ctx.restore(); // restore context
    return null;
  };
  
  // Given a mouse event, returns the game loation at the event's
  // position, or null if it doesn't correspond to a cell, tableau or foundation.
  // We use this on mouseup to determine the destination of a card.  
  function getLocationAtEventPosition(e) {
    var i,            // loop counter
        canvasRect,    // canvas bounding rectangle
        canvasX,      // mouse X converted to canvas X
        canvasY;      // mouse Y converted to canvas Y
        
    if (d.debug === d.DEBUGCRAZY) { console.log('view.getCardAtEventPosition: ' + e); }
    
    // get canvas coordinates from mouse coordinates    
    canvasRect = ctx.canvas.getBoundingClientRect();
    if (e.changedTouches) {
      canvasX = e.changedTouches[0].pageX - canvasRect.left;
      canvasY = e.changedTouches[0].pageY - canvasRect.top;
    } else {
       canvasX = e.clientX - canvasRect.left;
       canvasY = e.clientY - canvasRect.top;
    }
    ctx.save(); // save current context
    
    // Test if we've clicked in one of the four cells. 
    for (i = m.CELL1; i < m.CELL4 + 1; i++) {
      
      // Create a rectangle path at the cell location
      ctx.beginPath();
      ctx.rect(COL_n_X[i], TOPY, CARDWIDTH, CARDHEIGHT);
      
      // Test if our click point is within the rectangle path
      if (ctx.isPointInPath(canvasX, canvasY)) {
        if (d.debug === d.DEBUGALL) { console.log('view.getLocationAtEventPosition: ' + i); }
        ctx.restore(); // restore context
        return i; // will be a cell location constant
      }
    }

    // Test if we've clicked in one of the eight tableaux. 
    for (i = 1; i < tabs.length; i++) {

      // Create a rectangle path at the tableau location
      ctx.beginPath();
      ctx.rect(COL_n_X[i], TABLEAUY, CARDWIDTH, ctx.canvas.height - TABLEAUY);
      
      // Test if our click point is within the rectangle path
      if (ctx.isPointInPath(canvasX, canvasY)) {
        if (d.debug === d.DEBUGALL) { console.log('view.getLocationAtEventPosition: ' + i); }
        ctx.restore(); // restore context
        return tabs[i]; // will be a tableau location constant
      }      
    }
        
      // Test if we've clicked in one of the four foundations. 
    for (i = m.FOUNDATION1; i < m.FOUNDATION4 + 1; i++) {
      
      // Create a rectangle path at the foundation's location
      ctx.beginPath();
      ctx.rect(COL_n_X[i], TOPY, CARDWIDTH, CARDHEIGHT);
      
      // Test if our click point is within the rectangle path
      if (ctx.isPointInPath(canvasX, canvasY)) {
        if (d.debug === d.DEBUGALL) { console.log('view.getLocationAtEventPosition: ' + i); }
        ctx.restore(); // restore context
        return i; // will be a foundation location constant
      }
    }

    // Not found
    ctx.restore(); // restore context
    return null;
  };
    
  //// Utility methods ////
  
  // Creates a rounded rectangle's path where...
  // x, y is upper left corner of the rectangle
  // width, height defines the rectangle's dimensions
  // radius defines corner radius
  roundedRect = function (x, y, width, height, radius) {
    if (d.debug === d.DEBUGCRAZY) { console.log('view.roundedRect: ' + 
      x + ', ' + y + ', ' + width + ', ' + height + ', ' + radius); }

    ctx.beginPath(); // context at the module level
    
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
  };
  
  // Strokes the path of a rounded rectangle, see roundedRect args
  // Should be preceded by a strokeStyle statement.
  strokeRoundedRect = function (x, y, width, height, radius) {
    if (d.debug === d.DEBUGCRAZY) { console.log('view.strokeRoundedRect: ' + 
      x + ', ' + y + ', ' + width + ', ' + height + ', ' + radius); }
      
    that.roundedRect(x, y, width, height, radius);
    ctx.stroke();
  };
  
  // Fills a rounded rectangle's path, see roundedRect args
  // Should be preceded by a fillStyle statement.
  fillRoundedRect = function (x, y, width, height, radius) {
    if (d.debug === d.DEBUGCRAZY) { console.log('view.fillRoundedRect: ' + 
      x + ', ' + y + ', ' + width + ', ' + height + ', ' + radius); }

    that.roundedRect(x, y, width, height, radius);
    ctx.fill();
  };

  return { 
    newGame                    : newGame,
    refreshDisplay             : refreshDisplay,
    getCardAtEventPosition     : getCardAtEventPosition,
    getLocationAtEventPosition : getLocationAtEventPosition,
    moveCards                  : moveCards,
    setMetrics                 : setMetrics
  };
  
})();