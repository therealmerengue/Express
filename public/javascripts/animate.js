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

function movePoint(m) {
    var route = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    map.getSource('point')._data.features[0].geometry.coordinates,
                    m.geometry.coordinates
                ]
            }
        }]
    };
    // Calculate the distance in kilometers between route start/end point.
    var lineDistance = turf.lineDistance(route.features[0], 'kilometers');

    var arc = [];

    // Draw an arc between the `origin` & `destination` of the two points
    for (var i = 0; i < lineDistance; i++) {
        var segment = turf.along(route.features[0], i / 10 * lineDistance, 'kilometers');
        arc.push(segment.geometry.coordinates);
    }

    // Update the route with calculated arc coordinates
    route.features[0].geometry.coordinates = arc;

    // Used to increment the value of the point measurement against the route.
    var counter = 0;

    (function animate() {
        // Update point geometry to a new position based on counter denoting
        // the index to access the arc.
        point.features[0].geometry.coordinates = route.features[0].geometry.coordinates[counter];

        // Update the source with this new data.
        try {
            map.getSource('point').setData(point);
        } catch(err) {}

        // Request the next frame of animation so long as destination has not
        // been reached.

        if (counter < 10) {
            requestAnimationFrame(animate);
        }

        counter = counter + 1;
    })(counter);
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

function movePointsAnimated(points, map) {
    var currentPoints = map.getSource('points')._data.features;
    var unchangedPoints = [];
    var movedPoints = [];
    var changedNotMovedPoints = [];
    var preChangedPoints = []; //for history

    var routes = [];

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
            var arc = [];

            for (var j = 0; j < lineDistance; j++) {
                var segment = turf.along(route.features[0], j / 10 * lineDistance, 'kilometers');
                arc.push(segment.geometry.coordinates);
            }

            route.features[0].geometry.coordinates = arc;
            routes.push(route);
            movedPoints.push(points[i]);
            preChangedPoints.push(currentPoints[i]);
        }
    }

    var counter = 0;

    if (movedPoints.length == 0)
    {
        if (changedNotMovedPoints.length != 0) {
            makeHistoryPostRequest(preChangedPoints);
            setSourceData(changedNotMovedPoints.concat(unchangedPoints));
        }
        return;
    }

    makeHistoryPostRequest(preChangedPoints);

    (function animatePoints() {
        for (var i = 0; i < movedPoints.length; i++) {
            movedPoints[i].geometry.coordinates = routes[i].features[0].geometry.coordinates[counter];
        }

        setSourceData(movedPoints.concat(changedNotMovedPoints.concat(unchangedPoints)));

        if (counter < 10) {
            requestAnimationFrame(animatePoints);
        }
        counter = counter + 1;
    })(counter);


    /*var data = {
        "type": "FeatureCollection",
        "features": points
    }
    map.getSource('points').setData(data);*/
};