var vehicleController = (function() {
    function getVehicle(plate) {
        $.ajax({
            url: '/info/' + plate,
            success: function(data) {
                presentData(data);
                map.flyTo({
                    center: data.current[0].geometry.coordinates,
                    zoom: map.getZoom() < 11 ? 11 : map.getZoom()
                });
                var popupDiv = getPopup({
                    plate: data.current[0].properties.plate,
                    speed: data.current[0].properties.speed,
                    distance: data.current[0].properties.distance
                });
                new mapboxgl.Popup()
                    .setLngLat(data.current[0].geometry.coordinates)
                    .setDOMContent(popupDiv)
                    .addTo(map);
            },
            complete: this.ajax_complete,
            dataType: 'json'
        });
    }

    function insertVehicleHistory(preChangedPoints) {
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

    return {
        getVehicle: getVehicle,
        insertVehicleHistory: insertVehicleHistory
    }
})();