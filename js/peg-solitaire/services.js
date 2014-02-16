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
      this.rulesToggle = 'Show Rules';
      this.rulesToggleDisabled = '';
      this.showScore = 'show';
      this.undoDisabled = 'disabled';
      this.redoDisabled = 'disabled';
      this.showGameOver = 'hide';
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
          p.cursor = 'pointer';
        }
        else {
          p.image = 'no-ball.png';
          p.cursor = 'defaultCursor';
        }
        this.positions[i] = p;
        this.ttlPossibleMoves += p.possibleMoves;
      }
      if (this.ttlPossibleMoves == 0) {
        this.state = 'game over';
        this.showGameOver = 'show;'
      }
      else {
        this.showGameOver = 'hide';
      }
    },
    moveHistory: [],    
    pegsRemaining: 0,
    positions: [],
    redoDisabled: 'disabled',
    rulesToggle: 'Hide Rules',
    showRules: 'show',
    rulesToggleDisabled: 'disabled',
    showScore: 'hide',
    showGameOver: 'hide',
    undoDisabled: 'disabled',
    state: 'waiting to start',
    ttlPossibleMoves: 0,
    undoHistory: [],
  };
});


