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
