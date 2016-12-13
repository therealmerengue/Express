var app = angular.module('trackingApp');

app.controller('VehicleController', ['$scope', '$http',
    function($scope, $http) {
        console.log('VehicleController loaded...');
        $http.get('/all').success(function(response) {
            console.log(response);
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
            });
            socket.on('insert', function(data) {
                console.log(data);
                pointModule.insertPoint(data, map);
            });
            socket.on('delete', function(data) {
                console.log(data);
                pointModule.deletePoint(data, map);
            });

            $scope.map = map;
        });

        $scope.styles = ['/styles/style.json', '/styles/basic.json', '/styles/light.json', '/styles/dark.json', '/styles/street.json'];

        $scope.setStyle = function(style) {
            $scope.map.setStyle(style);
        };

        $scope.getVehicle = function(plate) {
            $http.get('/info/' + plate).success(function(response) {
                presentData(response);
                $scope.map.flyTo({
                    center: response.current[0].geometry.coordinates,
                    zoom: $scope.map.getZoom() < 11 ? 11 : $scope.map.getZoom()
                });
                var popupDiv = getPopup({
                    plate: response.current[0].properties.plate,
                    speed: response.current[0].properties.speed,
                    distance: response.current[0].properties.distance
                });
                new mapboxgl.Popup()
                    .setLngLat(response.current[0].geometry.coordinates)
                    .setDOMContent(popupDiv)
                    .addTo($scope.map);
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