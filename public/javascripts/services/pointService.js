var app = angular.module('trackingApp');

app.service('vehicleService', ['$http', function($http) {
    var sortByPlate = function(v1, v2) {
        var plate1 = v1.properties.plate;
        var plate2 = v2.properties.plate;
        return plate1.localeCompare(plate2);
    };

    var setSourceData = function(features, map) {
        map.getSource('points').setData({
            "type": "FeatureCollection",
            "features": features
        });
    };

    var insertVehicleHistory = function(point) {
        $http.post('/insert', {
            vehicleData: point
        }).success(function(response) {
            console.log('History inserted');
        });
    };

    this.updateVehicle = function(point, map) {
        var parsed = JSON.parse(point);
        var currentPoints = map.getSource('points')._data.features;

        for (var i = 0; i < currentPoints.length; i++) {
            if (currentPoints[i].properties.plate == parsed[0].properties.plate) {
                console.log(currentPoints[i]);
                insertVehicleHistory(currentPoints[i]);
                currentPoints[i] = parsed[0];
                setSourceData(currentPoints, map);
                break;
            }
        }
    };

    this.insertVehicle = function(point, map) {
        var currentPoints = map.getSource('points')._data.features;

        currentPoints.push(point);
        currentPoints.sort(sortByPlate);

        setSourceData(currentPoints, map);
    };

    this.deleteVehicle = function(point, map) {
        var currentPoints = map.getSource('points')._data.features;
        for (var i = 0; i < currentPoints.length; i++) {
            if (currentPoints[i]._id == point._id) {
                console.log(currentPoints[i]);
                insertVehicleHistory(currentPoints[i]);
                currentPoints.splice(i, 1);
                break;
            }
        }
        setSourceData(currentPoints, map);
    };
}]);