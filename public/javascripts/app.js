var app = angular.module('trackingApp', ['ngRoute']);
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/all', {
        templateUrl: '/'
    })
}]);
