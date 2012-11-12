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
      tabsBottomY = [0, 0, 0, 0, 0, 0, 0, 0, 0]; 
      
      // measurement constants
      
      // Column x positions individually, and in another 1-based array
      COL1X = 20, 
      COL2X = 143,
      COL3X = 266,
      COL4X = 389,
      COL5X = 512,
      COL6X = 635,
      COL7X = 758,
      COL8X = 881,
      COL_n_X = [0, COL1X, COL2X, COL3X, COL4X, COL5X, COL6X, COL7X, COL8X],
      
      // Other pixel-based constants
      TOPY = 45,  // card y positions for cells and foundations
      TABLEAUY = 227, // top card y position for tableau
      CARDWIDTH = 113, // card width 
      CARDHEIGHT = 157, // card height
      CARDYOFFSET = 26, // for casades in tableau
      CARDRADIUS = 7, // corner radius
      
      // colors
      CELLBKGDCOLOR = "#3A5E21",
      FOUNDBKGDCOLOR = "#4C7B2C",
      CARDSHADOWCOLOR = "#16240D";
      TABLEAUBKGDCOLOR = "";
      
      if (d.debug > d.NODEBUG) { console.log('view'); }
  
  //// Game methods ////
  
  // Shuffle the cards, lay them out, and start the game.
  function newGame($canvasBox) {
    var $canvas = $('<canvas>MikeyCell</canvas>')[0],
        width = $canvas.width = $canvasBox.width(), // as wide as container
        height = $canvas.height = $canvasBox.height(); // as tall as container
        
    if (d.debug > d.NODEBUG) { console.log('view.newGame'); }

    // create canvas and get its context
    $($canvasBox).html($canvas);
    ctx = $canvas.getContext('2d');
    
    paintCellAndFoundationBkgds();

    // shadows for cards
    ctx.shadowColor = CARDSHADOWCOLOR;
    ctx.shadowBlur = 1;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 2;

    // Get a new sorted deck and refresh the tableaux
    m.Deck = c.newDeck(true); // sorted
    m.Tableau.sortInto(m.Deck);
    for (t = 1; t < tabs.length; t++) {
      refreshTableauDisplay(t);
    }

  }
  
  // Brute force method refreshes all tableau, cell and foundation displays, called externally
  function refreshDisplay() {
    if (d.debug === d.DEBUGALL) { console.log('view.refreshDisplay'); }
    
    refreshCellDisplay(m.CELL1);
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
  };

  // Refresh display of a specific tableau after shuffle or move
  function refreshTableauDisplay(tabNumber) {
    var i,
        theTableau,
        theCard;
        
    if (d.debug === d.DEBUGALL) { console.log('view.refreshTableauDisplay: ' + tabNumber); }
    
    // clear the tableau background to accomodate a card being moved
    ctx.clearRect(COL_n_X[tabNumber],
              TABLEAUY,
              CARDWIDTH + 2,
              tabsBottomY[tabNumber] + 2);

    for (i = 0; i < m.Tableau[tabs[tabNumber]].length; i++) {
        theTableau = m.Tableau[tabs[tabNumber]];
        theCard = theTableau[i];
        // draws a card in this tableau's column, cascaded down from it's predecessor
        ctx.drawImage(theCard.image, 
                      COL_n_X[tabNumber], 
                      TABLEAUY + (i * CARDYOFFSET), 
                      CARDWIDTH, 
                      CARDHEIGHT);
        // set the lower Y boundary of this tableau for later clearing
        tabsBottomY[tabNumber] = TABLEAUY + (i * CARDYOFFSET) + CARDHEIGHT;
    }
  };
  
  // Refreshes one of the cells
  function refreshCellDisplay(cellNumber) {
    var theCard;
    
    if (d.debug === d.DEBUGALL) { console.log('view.refreshCellDisplay: ' + cellNumber); }

    theCard = m.Cells[cellNumber]; // 1 - 4
    if (theCard) {
      // draw the card in the cell
      ctx.drawImage(theCard.image,
                    COL_n_X[cellNumber],
                    TOPY,
                    CARDWIDTH,
                    CARDHEIGHT);
    } else {
      // no card there, draw the cell background
      ctx.fillStyle = CELLBKGDCOLOR;
      fillRoundedRect(COL_n_X[cellNumber], TOPY, CARDWIDTH, CARDHEIGHT, CARDRADIUS);
    };
  };
  
  // Refreshes one of the foundations
  function refreshFoundation(foundationNumber) {
    var theCard,
        f = m.Foundations[foundationNumber]; // 5 - 8
    
    if (d.debug === d.DEBUGALL) { console.log('view.refreshFoundationDisplay: ' + foundationNumber); }

    theCard = f[f.length - 1]; // just draw the last card
    if (theCard) {
      // draw the card in the foundation
      ctx.drawImage(theCard.image,
                    COL_n_X[foundationNumber],
                    TOPY,
                    CARDWIDTH,
                    CARDHEIGHT);
    } else {
      // no card there, draw the cell background
      ctx.fillStyle = FOUNDBKGDCOLOR;
      fillRoundedRect(COL_n_X[foundationNumber], TOPY, CARDWIDTH, CARDHEIGHT, CARDRADIUS);
    }
  };
    
  // Paints the lighter cells and foundations above the tableaux.
  function paintCellAndFoundationBkgds() {
    if (d.debug === d.DEBUGALL) { console.log('view.paintCellAndFoundationBkgds'); }

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
  }
  
  //// Utility methods ////
  
  // Creates a rounded rectangle's path where...
  // x, y is upper left corner of the rectangle
  // width, height defines the rectangle's dimensions
  // radius defines corner radius
  roundedRect = function (x, y, width, height, radius) {
    if (d.debug === d.DEBUGALL) { console.log('view.roundedRect: ' + 
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
  }
  
  // Strokes the path of a rounded rectangle, see roundedRect args
  // Should be preceded by a strokeStyle statement.
  strokeRoundedRect = function (x, y, width, height, radius) {
    if (d.debug === d.DEBUGALL) { console.log('view.strokeRoundedRect: ' + 
      x + ', ' + y + ', ' + width + ', ' + height + ', ' + radius); }
      
    that.roundedRect(x, y, width, height, radius);
    ctx.stroke();
  }
  
  // Fills a rounded rectangle's path, see roundedRect args
  // Should be preceded by a fillStyle statement.
  fillRoundedRect = function (x, y, width, height, radius) {
    if (d.debug === d.DEBUGALL) { console.log('view.fillRoundedRect: ' + 
      x + ', ' + y + ', ' + width + ', ' + height + ', ' + radius); }

    that.roundedRect(x, y, width, height, radius);
    ctx.fill();
  }

  return { 
    newGame        : newGame,
    refreshDisplay : refreshDisplay
  };
  
})();