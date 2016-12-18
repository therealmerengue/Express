var app = angular.module('trackingApp', ['ngRoute', "pageslide-directive"]);
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/all', {
        templateUrl: '/'
    })
}]);
