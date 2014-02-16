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







