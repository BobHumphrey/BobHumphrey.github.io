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
