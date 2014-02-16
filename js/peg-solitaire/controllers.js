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







