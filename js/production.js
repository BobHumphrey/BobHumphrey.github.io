//$(document).ready(function() {
//  $("#outerWrapper").hide();
//});
//$(window).load(function() {
//  $("#outerWrapper").show();
//});


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


