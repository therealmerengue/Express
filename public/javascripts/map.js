function getMap(options, pointData) {
    var map = new mapboxgl.Map(options);

    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
    map.addControl(new mapboxgl.NavigationControl({position: 'top-right'}));

    map.on('style.load', function() {
        map.addSource('points', {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": pointData
            },
            cluster: true,
            clusterMaxZoom: 14, // Max zoom to cluster points on
            clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        });
        map.addLayer({
            "id": "points",
            "type": "symbol",
            "source": "points",
            "filter": ["!has", "point_count"],
            "layout": {
                "icon-image": "{icon}-15",
                "text-field": "{title}",
                "text-font": ["Open Sans Semibold"],
                "text-offset": [0, 0.6],
                "text-anchor": "top"
            }
        });

        //cluster layers - colors depending on count
        var layers = [
            [150, '#f28cb1'],
            [20, '#f1f075'],
            [0, '#51bbd6']
        ];

        //adding clusters
        layers.forEach(function(layer, i) {
            map.addLayer({
                "id": "cluster-" + i,
                "type": "circle",
                "source": "points",
                "paint": {
                    "circle-color": layer[1],
                    "circle-radius": 18
                },
                "filter": i === 0 ?
                    [">=", "point_count", layer[0]] :
                    ["all",
                        [">=", "point_count", layer[0]],
                        ["<", "point_count", layers[i - 1][0]]]
            });
        });
        //cluster labels
        map.addLayer({
            "id": "cluster-count",
            "type": "symbol",
            "source": "points",
            "layout": {
                "text-field": "{point_count}",
                "text-font": [
                    "Open Sans Semibold"
                ],
                "text-size": 12
            }
        });
    });

    map.on('click', function(e) {
        // Use queryRenderedFeatures to get features at a click event's point
        // Use layer option to avoid getting results from other layers
        var pointFeatures = map.queryRenderedFeatures(e.point, {layers: ['points']});
        // if there are features within the given radius of the click event,
        // fly to the location of the click event
        if (pointFeatures.length) {
            $.ajax({
                url: '/info/' + pointFeatures[0].properties.plate.replace(/\s/g, '%20'),
                success: function(data) {
                   presentData(data);
                },
                complete: this.ajax_complete,
                dataType: 'json'
            });

            map.flyTo({center: pointFeatures[0].geometry.coordinates, zoom: 10});

            var popupDiv = getPopup({
                plate: pointFeatures[0].properties.plate,
                speed: pointFeatures[0].properties.speed,
                distance: pointFeatures[0].properties.distance
            });
            //display pop up with coords
            new mapboxgl.Popup()
                .setLngLat(pointFeatures[0].geometry.coordinates)
                .setDOMContent(popupDiv)
                .addTo(map);
        }

        var clusterFeatures = map.queryRenderedFeatures(e.point, {layers: ['cluster-0', 'cluster-1', 'cluster-2']});
        if (clusterFeatures.length) {
            map.flyTo({
                center: e.lngLat,
                zoom: map.getZoom() + 2
            });
        }
    });

    // Use the same approach as above to indicate that the symbols are clickable
    // by changing the cursor style to 'pointer'.
    map.on('mousemove', function (e) {
        var features = map.queryRenderedFeatures(e.point, {layers: ['points', 'cluster-0', 'cluster-1', 'cluster-2']});
        map.getCanvas().style.cursor = features.length ? 'pointer' : '';
    });

    return map;
}