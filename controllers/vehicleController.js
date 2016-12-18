var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/vehicles');

var models = require('../models/vehicle');

module.exports.getVehicles = function(req, res) {
    models.vehicleData.find({}, models.selectObject)
        .then(function(doc) {
            res.send(doc);
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