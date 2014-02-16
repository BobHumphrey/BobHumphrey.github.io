var pegApp = angular.module('pegApp', [], function() {
});

pegApp.config([
  '$interpolateProvider', function($interpolateProvider) {
    return $interpolateProvider.startSymbol('{(').endSymbol(')}');
  }
]);
