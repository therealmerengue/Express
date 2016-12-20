var app = angular.module('trackingApp');

var selectedPoint = {};

app.controller('VehicleController', ['$scope', '$http', '$window', '$timeout',
    function($scope, $http, $window, $timeout) {
        console.log('VehicleController loaded...');

        var updateChart = function(chart, label, newData) {
            chart.data.labels.push(label); // add new label at end
            chart.data.labels.splice(0, 1); // remove first label
            chart.data.datasets[0].data.push(newData);
            chart.data.datasets[0].data.splice(0, 1);
            chart.update();
        };

        var triggerInfoButtonClick = function(clicks) {
            for (var c = 0; c < clicks; c++) {
                angular.element(document.querySelector('#info-button')).trigger('click');
            }
        };

        $http.get('/all').success(function(response) {
            $scope.points = response;
            var map = getMap({
                container: 'map',
                center: [0, 0],
                zoom: 1.01,
                bearing: 0,
                pitch: 0,
                minZoom: 1,
                style: '/styles/style.json',
                maxBounds: [
                    [-185.0, -85.0], // Southwest coordinates
                    [185.0, 85.0]  // Northeast coordinates
                ]
            }, response);

            var socket = io();

            socket.on('change', function(data) {
                console.log(data);
                pointModule.updatePoint(data, map);
                var parsed = JSON.parse(data);
                if ($scope.selectedPoint != undefined && parsed[0].properties.plate == $scope.selectedPoint.properties.plate) {
                    updateChart($scope.charts[0], parsed[0].properties.date.toString().substring(0, 19).replace('T', ' '), parsed[0].properties.speed);
                    updateChart($scope.charts[1], parsed[0].properties.date.toString().substring(0, 19).replace('T', ' '), parsed[0].properties.distance);
                    $scope.selectedPoint = parsed[0];
                    $scope.map.flyTo({
                        center: $scope.selectedPoint.geometry.coordinates
                    });
                }
            });

            socket.on('insert', function(data) {
                console.log(data);
                pointModule.insertPoint(data, map);
            });

            socket.on('delete', function(data) {
                console.log(data);
                pointModule.deletePoint(data, map);
            });

            socket.on('vehicleSent', function(data) {
                if ($scope.charts != undefined) {
                    for (var i = 0; i < $scope.charts.length; i++) {
                        $scope.charts[i].destroy();
                    }
                }
                $scope.charts = presentData(data);
            });

            $scope.socket = socket;

            $scope.map = map;
        });

        $scope.styles = ['/styles/style.json', '/styles/basic.json', '/styles/light.json', '/styles/dark.json', '/styles/street.json'];

        $scope.setStyle = function(style) {
            $scope.map.setStyle(style);
        };

        $scope.getVehicleSocket = function(point) {
            if (point != $window.selectedPoint)
                $scope.socket.emit('getVehicle', { plate: point.properties.plate });

            if (!angular.element('#info-pane').scope().checked) {
                $timeout(function() {
                    triggerInfoButtonClick(1);
                }, 0);
            } else {
                $timeout(function() {
                    triggerInfoButtonClick(2);
                }, 0);
            }

            $scope.selectedPoint = point;
            $window.selectedPoint = $scope.selectedPoint;

            $scope.map.flyTo({
                center: point.geometry.coordinates
            });
        };

        $scope.insertVehicleHistory = function(preChangedPoints) {
            $http.post('/insert', {
                vehicleData: JSON.stringify(preChangedPoints)
            }).success(function(response) {
                console.log('History inserted');
            });
        };
    }
]);