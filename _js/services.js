matchApp.factory('Game', function () {
  
  function shuffle(array) {
    var currentIndex = array.length
    , temporaryValue
    , randomIndex
    , save        
    ;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    save = array[0];
    array[0] = array[20];
    array[20] = save;
    return array;
  }
  
  var icons = [
    "icon-heart",
    "icon-star",
    "icon-lock",
    "icon-eye",
    "icon-cup",
    "icon-trash",
    "icon-cog",
    "icon-clock",
    "icon-lightbulb",
    "icon-cd",
    "icon-globe",
    "icon-cloud",
    "icon-fire",
    "icon-graduation-cap",
    "icon-key",
    "icon-beaker",
    "icon-truck",
    "icon-food",
    "icon-diamond",
    "icon-t-shirt",
    "icon-heart",
    "icon-star",
    "icon-lock",
    "icon-eye",
    "icon-cup",
    "icon-trash",
    "icon-cog",
    "icon-clock",
    "icon-lightbulb",
    "icon-cd",
    "icon-globe",
    "icon-cloud",
    "icon-fire",
    "icon-graduation-cap",
    "icon-key",
    "icon-beaker",
    "icon-truck",
    "icon-food",
    "icon-diamond",
    "icon-t-shirt",
  ];
  var cards = Array();
  var player1Matches = Array();
  var player2Matches = Array();

  return {
    initialize: function() {
      shuffle(this.icons);
      for (var x=0; x<40; x++) {
        this.cards[x] = {
          state: 'show-card',
          displayValue: '',
          value: this.icons[x],
        };
      }
      for (var x=0; x<20; x++) {
        this.player1Matches[x] = {
          value: '',
        };
        this.player2Matches[x] = {
          value: '',
        };
      }
    },
    cards: cards,
    currentPlayer: 0,
    firstPick: '',
    firstPickIndex: 0,
    icons: icons,
    instructions: '',
    matchCount: 0,
    moves: 0,
    player1Matches: player1Matches,
    player1Score: 0,
    player1Turn: '',
    player2Matches: player2Matches,
    player2Score: 0,
    player2Turn: '',
    players: 1,
    secondPick: '',
    showButtons: '',
    showInstructions: 'hide',
    showPlayer2: '',
    showScore: 'hide',
    showStart: '',
    state: 'waiting to start',
  };
});














pegApp.factory('Game', function () {
  return {
    initialize: function() {
      var position;
      var x = 0;
      var y = 0;
      for (var i = 0; i < 49; i++) {
        // Is the position in play?
        var inPlay = true;
        if ((x < 2) && (y < 2)) {
          inPlay = false;
        }
        else if ((x < 2) && (y > 4)) {
          inPlay = false;
        }
        else if ((x > 4) && (y < 2)) {
          inPlay = false;
        }
        else if ((x > 4) && (y > 4)) {
          inPlay = false;
        }
        // Is the position occupied?
        if ((inPlay) && (i != 24)) {
          occupied = true;
        }
        else {
          occupied = false;
        }
        // North move
        if ((inPlay == false) || (y < 2)) {
          northJump = 0;
          northLand = 0;
          northPossible = false;
        }
        else if (this.positions[i - 14].inPlay == false) {
          northJump = 0;
          northLand = 0;
          northPossible = false;
        }
        else {
          northJump = i - 7;
          northLand = i - 14;
          northPossible = true;
        }
        // West move
        if ((inPlay == false) || (x < 2)) {
          westJump = 0;
          westLand = 0;
          westPossible = false;
        }
        else if (this.positions[i - 2].inPlay == false) {
          westJump = 0;
          westLand = 0;
          westPossible = false;
        }
        else {
          westJump = i -1;
          westLand = i -2;
          westPossible = true;
        }
        this.positions[i] = {
          x: x,
          y: y,
          class: 'inPlay' + inPlay,
          inPlay: inPlay,
          occupied: occupied,
          image: '',
          northPossible : northPossible,
          northJump: northJump,
          northLand: northLand,
          northValid: false,
          westPossible : westPossible,
          westJump: westJump,
          westLand: westLand,
          westValid: false,
        }
        x++;
        if (x > 6) {
          x = 0;
          y++;
        }
      }
      x = 0;
      y = 0;
      for (i = 0; i < 49; i++) {
        // South move
        if ((this.positions[i].inPlay == false) || (y > 4)) {
          southJump = 0;
          southLand = 0;
          southPossible = false;
        }
        else if (this.positions[i + 14].inPlay == false) {
          southJump = 0;
          southLand = 0;
          southPossible = false;
        }
        else {
          southJump = i + 7;
          southLand = i + 14;
          southPossible = true;
        }
        // East move
        if ((this.positions[i].inPlay == false) || (x > 4)) {
          eastJump = 0;
          eastLand = 0;
          eastPossible = false;
        }
        else if (this.positions[i + 2].inPlay == false) {
          eastJump = 0;
          eastLand = 0;
          eastPossible = false;
        }
        else {
          eastJump = i + 1;
          eastLand = i + 2;
          eastPossible = true;
        }
        position = this.positions[i];
        position.southPossible = southPossible;
        position.southJump = southJump;
        position.southLand = southLand;
        position.southValid = false;
        position.eastPossible = eastPossible;
        position.eastJump = eastJump;
        position.eastLand = eastLand;
        position.eastValid = false;
        this.positions[i] = position;
        x++;
        if (x > 6) {
          x = 0;
          y++;
        }
      }
      this.moveHistory.length = 0;
      this.undoHistory.length = 0;
      this.pegsRemaining = 32;
      this.showRules = 'hide';
      this.showScore = 'show';
      this.undoDisabled = 'disabled';
      this.redoDisabled = 'disabled';
    },
    setupNextMove: function() {
      var p;
      this.ttlPossibleMoves = 0;
      for (i = 0; i < 49; i++) {
        p = this.positions[i];
        p.possibleMoves = 0;
        p.northValid = false;
        p.westValid = false;
        p.southValid = false;
        p.eastValid = false;
        if (p.occupied) {
          // Evaluate move north.
          if (p.northPossible) {
            if ((this.positions[p.northJump].occupied) && 
              (this.positions[p.northLand].occupied == false)) {
                  p.northValid = true;
                  p.possibleMoves++;
              }
          }
          // Evaluate move south.
          if (p.southPossible) {
            if ((this.positions[p.southJump].occupied) && 
              (this.positions[p.southLand].occupied == false)) {
                  p.southValid = true;
                  p.possibleMoves++;
              }
          }
          // Evaluate move east.
          if (p.eastPossible) {
            if ((this.positions[p.eastJump].occupied) && 
              (this.positions[p.eastLand].occupied == false)) {
                  p.eastValid = true;
                  p.possibleMoves++;
              }
          }
          // Evaluate move west.
          if (p.westPossible) {
            if ((this.positions[p.westJump].occupied) && 
              (this.positions[p.westLand].occupied == false)) {
                  p.westValid = true;
                  p.possibleMoves++;
              }
          }
        }
        if (p.occupied) {
          p.image = 'blue-ball.png';
        }
        else {
          p.image = 'no-ball.png';
        }
        this.positions[i] = p;
        this.ttlPossibleMoves += p.possibleMoves;
      }
      if (this.ttlPossibleMoves == 0) {
        this.state = 'game over';
      }
    },
    moveHistory: [],    
    pegsRemaining: 0,
    positions: [],
    redoDisabled: 'disabled',
    rulesToggle: 'Show Rules',
    showRules: 'show',
    showScore: 'hide',
    undoDisabled: 'disabled',
    state: 'waiting to start',
    ttlPossibleMoves: 0,
    undoHistory: [],
  };
});


