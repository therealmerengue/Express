var app = angular.module('trackingApp');

app.controller('chartController', ['$scope', 'chartFactory',
    function($scope, chartFactory) {
      $scope.$on('updateChart', function(event, args) {
            chartFactory.updateChart($scope.charts[0], args.data[0].properties.date.toString().substring(0, 19).replace('T', ' '), args.data[0].properties.speed);
            chartFactory.updateChart($scope.charts[1], args.data[0].properties.date.toString().substring(0, 19).replace('T', ' '), args.data[0].properties.distance);
      });

      $scope.$on('createCharts', function(event, args) {
            if ($scope.charts != undefined) {
               for (var i = 0; i < $scope.charts.length; i++) {
                     $scope.charts[i].destroy();
               }
            }
            $scope.charts = chartFactory.presentData(args.data);
      });
}]);