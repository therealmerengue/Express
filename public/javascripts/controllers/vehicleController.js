var app = angular.module('trackingApp');

app.controller('VehicleController', ['$scope', '$http', '$timeout', 'mapFactory', 'vehicleService',
    function($scope, $http, $timeout, mapFactory, vehicleService) {

        var triggerInfoButtonClick = function(clicks) {
            for (var c = 0; c < clicks; c++) {
                angular.element(document.querySelector('#info-button')).trigger('click');
            }
        };

        $http.get('/all').success(function(response) {
            $scope.points = response;
            var map = mapFactory({
                container: 'map',
                center: [0, 0],
                zoom: 1,
                bearing: 0,
                pitch: 0,
                style: 'http://localhost:3000/styles/style.json',
                maxBounds: [
                    [-185.0, -85.0], // Southwest coordinates
                    [185.0, 85.0]  // Northeast coordinates
                ]       
            }, response);

            var socket = io();

            socket.on('change', function(data) {
                console.log(data);
                vehicleService.updateVehicle(data, map);
                var parsed = JSON.parse(data);
                if ($scope.selectedPoint != undefined && parsed[0].properties.plate == $scope.selectedPoint.properties.plate) {
                    $scope.$broadcast('updateChart', { data: parsed });
                    $scope.selectedPoint = parsed[0];
                    $scope.map.flyTo({
                        center: $scope.selectedPoint.geometry.coordinates
                    });
                }
            });

            socket.on('insert', function(data) {
                console.log(data);
                vehicleService.insertVehicle(data, map);
            });

            socket.on('delete', function(data) {
                console.log(data);
                vehicleService.deleteVehicle(data, map);
            });

            map.on('click', function(e) {
                var pointFeatures = map.queryRenderedFeatures(e.point, {layers: ['points']});
                if (pointFeatures.length) {
                    $scope.getVehicle(pointFeatures[0]);
                }
            });

            $scope.map = map;
        });

        $scope.getVehicle = function(point) {
            if ($scope.selectedPoint == undefined || point.properties.plate != $scope.selectedPoint.properties.plate) {
                $http.get('/info/' + point.properties.plate).success(function(data) {
                    $scope.$broadcast('createCharts', { data: data });
                });
            }

            if (document.querySelector('#info-pageslide').style.left == '-300px') {
                $timeout(function() {
                    triggerInfoButtonClick(1);
                }, 0);
            } else {
                $timeout(function() {
                    triggerInfoButtonClick(2);
                }, 0);
            }

            $scope.selectedPoint = point;

            $scope.map.flyTo({
                center: point.geometry.coordinates,
                zoom: $scope.map.getZoom() < 7 ? 7 : $scope.map.getZoom()
            });
        };
    }
]);