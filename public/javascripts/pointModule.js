var pointModule = (function() {

    function sortByPlate(v1, v2) {
        var plate1 = v1.properties.plate;
        var plate2 = v2.properties.plate;
        return plate1.localeCompare(plate2);
    }

    function setSourceData(features) {
        map.getSource('points').setData({
            "type": "FeatureCollection",
            "features": features
        });
    }

    function updatePoint(point, map) {
        var parsed = JSON.parse(point);
        var currentPoints = map.getSource('points')._data.features;

        for (var i = 0; i < currentPoints.length; i++) {
            if (currentPoints[i].properties.plate == parsed[0].properties.plate) {
                console.log(currentPoints[i]);
                vehicleController.insertVehicleHistory([currentPoints[i]]);
                currentPoints[i] = parsed[0];
                setSourceData(currentPoints);
                break;
            }
        }
    }

    function insertPoint(point, map) {
        var currentPoints = map.getSource('points')._data.features;

        currentPoints.push(point);
        currentPoints.sort(sortByPlate);

        setSourceData(currentPoints);
    }

    function deletePoint(point, map) {
        var currentPoints = map.getSource('points')._data.features;
        for (var i = 0; i < currentPoints.length; i++) {
            if (currentPoints[i]._id == point._id) {
                console.log(currentPoints[i]);
                vehicleController.insertVehicleHistory([currentPoints[i]]);
                currentPoints.splice(i, 1);
                break;
            }
        }
        setSourceData(currentPoints);
    }

    return {
        updatePoint: updatePoint,
        insertPoint: insertPoint,
        deletePoint: deletePoint
    };
})();