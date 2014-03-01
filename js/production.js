
//MATCH GAME

var matchApp = angular.module('matchApp', [], function() {
});

matchApp.config([
  '$interpolateProvider', function($interpolateProvider) {
    return $interpolateProvider.startSymbol('{(').endSymbol(')}');
  }
]);

matchApp.controller('MatchController', function MatchController($scope,
        $timeout, Game) {
  $scope.g = Game;

  function stateChange() {
    switch ($scope.g.state) {
      case 'waiting to start':
        $scope.g.showStart = 'show';
        $scope.g.showButtons = 'show';
        break;
      case 'set up new game':
        $scope.g.initialize();
        $scope.g.currentPlayer = 1;
        $scope.g.matchCount = 0;
        $scope.g.moves = 0;
        $scope.g.showStart = 'hide';
        $scope.g.showInstructions = 'show';
        $scope.g.player1Score = 0;
        $scope.g.player2Score = 0;
        $scope.g.showScore = 'show';
        $scope.g.state = 'ready for first pick';
        $scope.g.showButtons = 'hide';
        break;
      case 'ready for first pick':
        $scope.g.instructions = 'Player ' + $scope.g.currentPlayer + ' - make first selection';
        break;
      case 'ready for second pick':
        $scope.g.instructions = 'Player ' + $scope.g.currentPlayer + ' - make second selection';
        break;
      case 'game over':
        $scope.g.instructions = 'GAME OVER';
        $scope.g.player1Turn = 'otherPlayer';
        $scope.g.player2Turn = 'otherPlayer';
        $scope.g.showButtons = 'show';
        break;
    }
  }

  $scope.start1Person = function() {
    $scope.g.state = 'set up new game';
    $scope.g.players = 1;
    $scope.g.showPlayer2 = 'hide';
  }
  $scope.start2Person = function() {
    $scope.g.state = 'set up new game';
    $scope.g.players = 2;
    $scope.g.player1Turn = 'currentPlayer';
    $scope.g.player2Turn = 'otherPlayer';
    $scope.g.showPlayer2 = 'show';
  }
  $scope.pickCard = function($index) {
    // Process first selection.
    if ($scope.g.state == 'ready for first pick') {
      $scope.g.state = 'processing first pick';
      if ($scope.g.cards[$index].state == 'show-card') {
        $scope.g.cards[$index].displayValue = $scope.g.cards[$index].value;
        $scope.g.cards[$index].state = 'show-value';
        $scope.g.firstPick = $scope.g.cards[$index].value;
        $scope.g.firstPickIndex = $index;
        $scope.g.state = 'ready for second pick';
      }
    }
    // Process second selection
    else if ($scope.g.state == 'ready for second pick') {
      $scope.g.state = 'processing second pick';
      $scope.g.moves++;
      if ($scope.g.cards[$index].state == 'show-card') {
        $scope.g.cards[$index].displayValue = $scope.g.cards[$index].value;
        $scope.g.cards[$index].state = 'show-value';
        $scope.g.secondPick = $scope.g.cards[$index].value;
        // Show the user if a match has occured.
        if ($scope.g.firstPick == $scope.g.secondPick) {
          $scope.g.cards[$index].state = 'match-card';
          var $firstPick = $scope.g.firstPickIndex;
          $scope.g.cards[$firstPick].state = 'match-card';
        }
        // Compare the selections.  Determine if a match has occured.  
        // Update the score.  Update the card display.
        $timeout(function() {
          // match
          if ($scope.g.firstPick == $scope.g.secondPick) {
            // update score
            if ($scope.g.currentPlayer == 1) {
              var scoreIndex = $scope.g.player1Score;
              $scope.g.player1Matches[scoreIndex].value = $scope.g.cards[$index].value;
              $scope.g.player1Score++;
            }
            else if ($scope.g.currentPlayer == 2) {
              var scoreIndex = $scope.g.player2Score;
              $scope.g.player2Matches[scoreIndex].value = $scope.g.cards[$index].value;
              $scope.g.player2Score++;
            }
            // update cards
            $scope.g.matchCount++;
            $scope.g.cards[$index].displayValue = '';
            $scope.g.cards[$index].state = 'hide-card';
            var $firstPick = $scope.g.firstPickIndex;
            $scope.g.cards[$firstPick].displayValue = '';
            $scope.g.cards[$firstPick].state = 'hide-card';
            $scope.g.state = 'ready for first pick';
            // is game over?
            if ($scope.g.matchCount == 20) {
              $scope.g.state = 'game over';
            }
          }
          // no match
          else {
            $scope.g.cards[$index].displayValue = '';
            $scope.g.cards[$index].state = 'show-card';
            var $firstPick = $scope.g.firstPickIndex;
            $scope.g.cards[$firstPick].displayValue = '';
            $scope.g.cards[$firstPick].state = 'show-card';
            $scope.g.state = 'ready for first pick';
            // Determine next player in a two player game when the card
            // selections didn't match.
            if ($scope.g.players == 2) {
              $scope.g.currentPlayer = ($scope.g.currentPlayer == 1) ? 2 : 1;
              if ($scope.g.currentPlayer == 1) {
                $scope.g.player1Turn = 'currentPlayer';
                $scope.g.player2Turn = 'otherPlayer';
              }
              else {
                $scope.g.player1Turn = 'otherPlayer';
                $scope.g.player2Turn = 'currentPlayer';
              }
            } 
          }
        }, 1000);

      }
    }
  }
  updateScore = function() {

  }
  // Display the number of moves in the game.
  $scope.showMoves = function() {
    if ($scope.g.moves == 0) {
      return 'No moves';
    }
    if ($scope.g.moves == 1) {
      return '1 move';
    }
    else {
      return $scope.g.moves + ' moves';
    }
  }
  
  // Can be used to speed testing.
  $scope.showIcons = function() {
    return '';
    var display = '';
    for (var i = 0; i < 5; i++){
      for (var j = 0; j < 8; j++){
        var k = (i * 8) + j;
        display = display + i + '-' + j + '-' + $scope.g.icons[k] + '   ';
      }
    }
    return display;
  }

  $scope.$watch('g.state', stateChange);

});

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


//PEG-SOLITAIRE

var pegApp = angular.module('pegApp', [], function() {
});

pegApp.config([
  '$interpolateProvider', function($interpolateProvider) {
    return $interpolateProvider.startSymbol('{(').endSymbol(')}');
  }
]);

pegApp.controller('PegController', function PegController($scope,
        $timeout, Game) {
  $scope.g = Game;
  $scope.toggleRules = function() {
    if ($scope.g.rulesToggle == 'Show Rules') {
      $scope.g.showRules = 'show';
      $scope.g.rulesToggle = 'Hide Rules';
    }
    else {
      $scope.g.showRules = 'hide';
      $scope.g.rulesToggle = 'Show Rules';
    }
  }
  $scope.startGame = function() {
    $scope.g.initialize();
    $scope.g.setupNextMove();
    $scope.g.state = 'first choice';
  };
  $scope.undo = function() {
    if ($scope.g.moveHistory.length < 1) {
      return;
    }
    var u = $scope.g.moveHistory.pop();
    $scope.g.undoHistory.push(u);
    var p;
    p = $scope.g.positions[u.startLocation];
    p.occupied = true;
    $scope.g.positions[u.startLocation] = p;
    p = $scope.g.positions[u.landLocation];
    p.occupied = false;
    $scope.g.positions[u.landLocation] = p;
    p = $scope.g.positions[u.jumpLocation];
    p.occupied = true;
    $scope.g.positions[u.jumpLocation] = p;
    $scope.g.pegsRemaining++;
    $scope.g.setupNextMove();
    setUndoRedo();
  }
  $scope.redo = function() {
    if ($scope.g.undoHistory.length < 1) {
      return;
    }
    var r = $scope.g.undoHistory.pop();
    $scope.g.moveHistory.push(r);
    var p;
    p = $scope.g.positions[r.startLocation];
    p.occupied = false;
    $scope.g.positions[r.startLocation] = p;
    p = $scope.g.positions[r.landLocation];
    p.occupied = true;
    $scope.g.positions[r.landLocation] = p;
    p = $scope.g.positions[r.jumpLocation];
    p.occupied = false;
    $scope.g.positions[r.jumpLocation] = p;
    $scope.g.pegsRemaining--;
    $scope.g.setupNextMove();
    setUndoRedo();
  }
  $scope.pickPosition = function(index) {
    var p;
    var move;
    var landLocation;
    var jumpLocation;
    var startLocation;
    if ($scope.g.state === 'first choice') {
      startLocation = index;
      $scope.g.state = 'processing first choice';
      p = $scope.g.positions[startLocation];
      if (p.possibleMoves === 1) {
        move = onlyMove(p);
        landLocation = move[0];
        jumpLocation = move[1];
        makeMove(startLocation, jumpLocation, landLocation);
        $scope.g.setupNextMove();
        $scope.g.moveHistory.push({
          startLocation: startLocation,
          landLocation: landLocation,
          jumpLocation: jumpLocation,
        });
        $scope.g.undoHistory.length = 0;
        setUndoRedo();
        $scope.g.pegsRemaining--;
        $scope.g.state = 'first choice';
      }
      else if (p.possibleMoves > 1) {
        startLocation = index;        
        p.image = 'green-ball.png';
        $scope.g.firstChoice = startLocation;
        $scope.g.state = 'second choice';
      }
      else if (p.occupied) {
        p.image = 'red-ball.png';
        $timeout(function() {
          p.image = 'blue-ball.png';
        }, 1000);
        $scope.g.state = 'first choice';
      }
      else {
        $scope.g.state = 'first choice';
      }
    }
    if ($scope.g.state == 'second choice') {
      landLocation = index;
      move = multipleMoves(landLocation);
      var validMove = move[0];
      if (validMove) {
        jumpLocation = move[2];
        makeMove($scope.g.firstChoice, jumpLocation, landLocation);
        $scope.g.setupNextMove();
        $scope.g.moveHistory.push({
          startLocation: $scope.g.firstChoice,
          landLocation: landLocation,
          jumpLocation: jumpLocation,
        });
        $scope.g.undoHistory.length = 0;
        setUndoRedo();
        $scope.g.pegsRemaining--;
        $scope.g.state = 'first choice';
      }
    }
  }
  onlyMove = function(thisP) {
    var thisMove = Array();
    if (thisP.northValid) {
      thisMove[0] = thisP.northLand;
      thisMove[1] = thisP.northJump;
    }
    else if (thisP.southValid) {
      thisMove[0] = thisP.southLand;
      thisMove[1] = thisP.southJump;
    }
    else if (thisP.eastValid) {
      thisMove[0] = thisP.eastLand;
      thisMove[1] = thisP.eastJump;
    }
    else if (thisP.westValid) {
      thisMove[0] = thisP.westLand;
      thisMove[1] = thisP.westJump;
    }
    return thisMove;
  }
  multipleMoves = function(thisIndex) {
    var firstChoice = $scope.g.firstChoice;
    var firstP = $scope.g.positions[firstChoice];
    var thisMove = Array();
    thisMove[0] = false;
    if (firstP.northValid && firstP.northLand == thisIndex) {
      thisMove[0] = true;
      thisMove[1] = firstP.northLand;
      thisMove[2] = firstP.northJump;
    }
    else if (firstP.southValid && firstP.southLand == thisIndex) {
      thisMove[0] = true;
      thisMove[1] = firstP.southLand;
      thisMove[2] = firstP.southJump;
    }
    else if (firstP.eastValid && firstP.eastLand == thisIndex) {
      thisMove[0] = true;
      thisMove[1] = firstP.eastLand;
      thisMove[2] = firstP.eastJump;
    }
    else if (firstP.westValid && firstP.westLand == thisIndex) {
      thisMove[0] = true;
      thisMove[1] = firstP.westLand;
      thisMove[2] = firstP.westJump;
    }
    return thisMove;
  }
  makeMove = function(startLocation, jumpLocation, landLocation) {
    var p;
    p = $scope.g.positions[startLocation];
    p.occupied = false;
    $scope.g.positions[startLocation] = p;
    p = $scope.g.positions[landLocation];
    p.occupied = true;
    $scope.g.positions[landLocation] = p;
    p = $scope.g.positions[jumpLocation];
    p.occupied = false;
    $scope.g.positions[jumpLocation] = p;
  }
  setUndoRedo = function() {
    $scope.g.undoDisabled = ($scope.g.moveHistory.length < 1) ? 'disabled' : '';
    $scope.g.redoDisabled = ($scope.g.undoHistory.length < 1) ? 'disabled' : '';
  }
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


