var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/vehicles');

var models = require('../models/vehicle');

module.exports.getVehicles = function(req, res) {
    models.vehicleData.find({}, models.selectObject)
        .then(function(doc) {
            res.send(doc);
        });
};

module.exports.getVehicle = function(req, res) {
    var plate = req.params.plate;
    var vehicle = {};
    console.log(plate);
    models.vehicleData.find({'properties.plate': plate}, models.selectObject)
        .then(function(doc) {
            vehicle.current = doc;
            models.vehicleHistoryData.find({'properties.plate': plate}, models.selectObject)
                .then(function(doc) {
                    vehicle.history = doc;
                    res.send({
                        current: vehicle.current,
                        history: vehicle.history
                    });
                });
        });
};

module.exports.insertVehicleHistory = function(req, res) {
    console.log(req.body.vehicleData);
    var document = req.body.vehicleData;
    delete document._id;
    delete document.$$hashKey;
    models.vehicleHistoryData.collection.insert(document, function(err, r) {
        if (err) {
            console.log(err);
        }
    });

    res.redirect('/');
};