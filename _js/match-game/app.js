var matchApp = angular.module('matchApp', [], function() {
});

matchApp.config([
  '$interpolateProvider', function($interpolateProvider) {
    return $interpolateProvider.startSymbol('{(').endSymbol(')}');
  }
]);



