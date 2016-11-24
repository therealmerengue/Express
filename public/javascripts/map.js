var point = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [5, 5]
        }
    }]
};

function addSources() {
    //pubnub testing
    if (!map.getSource('drone')) {
        map.addSource('drone', {
            type: 'geojson',
            data: {
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        5, 5
                    ]
                },
                "type": "Feature",
                "properties": {
                    "description": "<strong>suh dude</strong>"
                }
            }
        });
    }

    map.addSource('point', {
        "type": "geojson",
        "data": point
    });
}

function addLayers() {
    if (!map.getLayer('drone'))
        map.addLayer({
            "id": "drone",
            "type": "symbol",
            "source": "drone",
            "layout": {
                "icon-image": "rocket-15"
            }
        });

    map.addLayer({
        "id": "point",
        "source": "point",
        "type": "symbol",
        "layout": {
            "icon-image": "airport-15",
            "icon-rotate": 90
        }
    });
}

function initMap(options) {
    var map = new mapboxgl.Map(options);

    map.addControl(new mapboxgl.NavigationControl({ position: 'top-right' }));

    //flyTo point testing
    map.on('load', function () {
        try {
            addSources();
            addLayers();
        } catch (error) { }
    });

    map.on('style.load', function () {
        try {
            addSources();
            addLayers();
        } catch (error) { }
    });

    map.on('click', function (e) {
        // Use queryRenderedFeatures to get features at a click event's point
        // Use layer option to avoid getting results from other layers
        var features = map.queryRenderedFeatures(e.point, { layers: ['points', 'drone'] });
        // if there are features within the given radius of the click event,
        // fly to the location of the click event
        if (features.length) {
            // Get coordinates from the symbol and center the map on those coordinates
            map.flyTo({ center: features[0].geometry.coordinates });

            //display pop up with coords
            var popup = new mapboxgl.Popup()
                .setLngLat(features[0].geometry.coordinates)
                .setHTML(features[0].geometry.coordinates + '<br />' + features[0].properties.description)
                .addTo(map);
        }
    });

    // Use the same approach as above to indicate that the symbols are clickable
    // by changing the cursor style to 'pointer'.
    map.on('mousemove', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['points', 'drone'] });
        map.getCanvas().style.cursor = features.length ? 'pointer' : '';
    });

    return map;
}