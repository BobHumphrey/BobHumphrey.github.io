var matchApp = angular.module('matchApp', [], function() {
});

matchApp.config([
  '$interpolateProvider', function($interpolateProvider) {
    return $interpolateProvider.startSymbol('{(').endSymbol(')}');
  }
]);

var pegApp = angular.module('pegApp', [], function() {
});


