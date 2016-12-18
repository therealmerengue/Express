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
                if (parsed[0].properties.plate == $scope.plate) {
                    updateChart($scope.charts[0], parsed[0].properties.date, parsed[0].properties.speed);
                    updateChart($scope.charts[1], parsed[0].properties.date, parsed[0].properties.distance);
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
            if (!angular.element('#info-pane').scope().checked) {
                $timeout(function () {
                    angular.element(document.querySelector('#info-button')).trigger('click');
                }, 0);
            }

            $scope.map.flyTo({
                center: point.geometry.coordinates,
                zoom: $scope.map.getZoom() < 11 ? 11 : $scope.map.getZoom()
            });

            if (point != $window.selectedPoint)
                $scope.socket.emit('getVehicle', { plate: point.properties.plate });

            $scope.selectedPoint = point;
            $window.selectedPoint = $scope.plate;
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