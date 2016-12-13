var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/vehicles');

var models = require('../models/vehicle');
var selectObject = {type:1, geometry:1, properties:1, _id:1};

module.exports.getVehicles = function(req, res) {
    models.vehicleData.find({}, selectObject)
        .then(function(doc) {
            res.send(doc);
        });
};

module.exports.getVehicle = function(req, res) {
    var plate = req.params.plate;
    var vehicle = {};
    console.log(plate);
    models.vehicleData.find({'properties.plate': plate}, selectObject)
        .then(function(doc) {
            vehicle.current = doc;
            models.vehicleHistoryData.find({'properties.plate': plate}, selectObject)
                .then(function(doc) {
                    vehicle.history = doc;
                    res.send(JSON.stringify(vehicle));
                });
        });
};

module.exports.insertVehicleHistory = function(req, res) {
    console.log(JSON.parse(req.body.vehicleData));
    var document = JSON.parse(req.body.vehicleData);
    delete document[0]._id;
    delete document[0].$$hashKey;
    models.vehicleHistoryData.collection.insertMany(document, function(err, r) {
        if (err) {
            console.log(err);
        }
    });

    res.redirect('/');
};