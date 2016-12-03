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