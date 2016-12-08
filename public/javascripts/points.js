function makeHistoryPostRequest(preChangedPoints) {
    $.ajax({
        type: "POST",
        url: "/insert",
        dataType: "json",
        data: {
            vehicleData: JSON.stringify(preChangedPoints)
        },
        success: function (data) {
            console.log('Success inserting data');
        },
        error: function () {
            console.log('Error inserting data');
        }
    });
}

function getPopup(data) {
    var popupDiv = window.document.createElement('div');

    var content = window.document.createElement('div');
    content.setAttribute('class', 'content panel panel-default material-panel material-panel_primary');

    var span = document.createElement('span');
    span.setAttribute('class', 'x');
    span.onclick = function() {
        span.parentElement.parentElement.remove();
        if (map.getZoom() > 8)
            map.flyTo({zoom: map.getZoom() - 3});
    };
    span.innerHTML = '&times;';

    var popupHeader = document.createElement('h3');
    popupHeader.innerHTML = data.plate;
    popupHeader.setAttribute('class', 'panel-heading material-panel__heading');

    var popupBody = document.createElement('div');
    popupBody.setAttribute('class', 'panel-body material-panel__body');

    var speed = document.createElement('h5');
    speed.innerHTML = 'Speed: ' + data.speed;
    var distance = document.createElement('h5');
    distance.innerHTML = 'Distance: ' + data.distance;

    var popupFooter = document.createElement('div');
    popupFooter.setAttribute('class', 'popup-footer');

    var historyButton = document.createElement('a');
    historyButton.setAttribute('class', 'btn btn-primary');
    historyButton.setAttribute('data-toggle', 'modal');
    historyButton.setAttribute('data-target', '#historyModal');
    historyButton.setAttribute('href', '#historyModal');
    historyButton.setAttribute('role', 'button');
    historyButton.setAttribute('style', 'display: block;');
    historyButton.innerHTML = 'Show history';
    historyButton.onclick = function() {
        //span.parentElement.remove();
    };

    popupHeader.appendChild(span);
    popupFooter.appendChild(historyButton);
    content.appendChild(popupHeader);
    popupBody.appendChild(speed);
    popupBody.appendChild(distance);
    content.appendChild(popupBody);
    content.appendChild(popupFooter);
    popupDiv.appendChild(content);

    popupDiv.style.visibility = 'visible';

    return popupDiv;
}

function movePoints(points, map) {
    var currentPoints = map.getSource('points')._data.features;
    var unchangedPoints = [];
    var movedPoints = [];
    var changedNotMovedPoints = [];
    var preChangedPoints = []; //for history

    var sortByPlate = function(v1, v2) {
        var plate1 = v1.properties.plate;
        var plate2 = v2.properties.plate;
        return plate1.localeCompare(plate2);
    }

    var setSourceData = function(features) {
        map.getSource('points').setData({
            "type": "FeatureCollection",
            "features": features
        });
    }

    currentPoints.sort(sortByPlate);
    points.sort(sortByPlate);

    if (currentPoints.length < points.length) {
        for (var c = 0; c < points.length; c++) {
            if (currentPoints[c] === undefined)
                currentPoints.splice(c, 0, points[c]);
            else if (points[c].properties.plate != currentPoints[c].properties.plate) {
                currentPoints.splice(c, 0, points[c]);
            }
        }
        setSourceData(currentPoints);
    } else if (currentPoints.length > points.length) {
        var removedPoints = [];
        for (var b = 0; b < currentPoints.length; b++) {
            if (points[b] === undefined) {
                removedPoints.push(currentPoints[b]);
                currentPoints.splice(b, 1);
                b--;
            }
            else if (currentPoints[b].properties.plate != points[b].properties.plate) {
                removedPoints.push(currentPoints[b]);
                currentPoints.splice(b, 1);
                b--;
            }
        }
        setSourceData(currentPoints);

        makeHistoryPostRequest(removedPoints);
    }

    for (var i = 0; i < points.length; i++) {
        var route = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        currentPoints[i].geometry.coordinates,
                        points[i].geometry.coordinates
                    ]
                }
            }]
        };

        var lineDistance = turf.lineDistance(route.features[0], 'kilometers');
        if (lineDistance == 0) {
            var changed = false;
            var props = Object.getOwnPropertyNames(points[i].properties).sort();
            for (var a = 0; a < props.length; a++) {
                if (points[i].properties[props[a]] != currentPoints[i].properties[props[a]]) {
                    changedNotMovedPoints.push(points[i]);
                    changed = true;
                    preChangedPoints.push(currentPoints[i]);
                    break;
                }
            }
            if (!changed)
                unchangedPoints.push(points[i]);
        }
        else {
            console.log(lineDistance);
            movedPoints.push(points[i]);
            preChangedPoints.push(currentPoints[i]);
        }
    }

    if (movedPoints.length == 0)
    {
        if (changedNotMovedPoints.length != 0) {
            makeHistoryPostRequest(preChangedPoints);
            setSourceData(changedNotMovedPoints.concat(unchangedPoints));
        }
        return;
    }

    makeHistoryPostRequest(preChangedPoints);

    setSourceData(movedPoints.concat(changedNotMovedPoints.concat(unchangedPoints)));
};