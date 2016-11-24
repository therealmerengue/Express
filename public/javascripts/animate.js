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

function movePoints(points) {
    var currentPoints = map.getSource('points')._data.features;
    var unchangedPoints = [];
    var changedPoints = [];
    var routes = [];
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
            changedPoints.push(points[i]);
        }
    }

    var counter = 0;

    if (changedPoints.length == 0)
        return;

    (function animatePoints() {
        for (var i = 0; i < changedPoints.length; i++) {
            changedPoints[i].geometry.coordinates = routes[i].features[0].geometry.coordinates[counter];
        }
        try {
            map.getSource('points').setData({
                "type": "FeatureCollection",
                "features": changedPoints.concat(unchangedPoints)
            });
        } catch (err) {}

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

