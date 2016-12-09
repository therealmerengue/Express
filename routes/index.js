var express = require('express');
var assert = require('assert');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/vehicles');

var models = require('../models/vehicle');
var selectObject = {type:1, geometry:1, properties:1, _id:0};

/* GET home page. */
router.get('/', function(req, res, next) {
    models.vehicleData.find({}, selectObject)
        .then(function(doc) {
            res.render('index', {
                points: doc,
                title: 'Tracking App'
            });
        });
});

router.get('/update', function(req, res, next) {
    models.vehicleData.find({}, selectObject)
        .then(function(doc) {
            res.send(JSON.stringify(doc));
        });
});

router.get('/info/:plate', function(req, res, next) {
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
});

router.post('/insert', function(req, res, next) {
    console.log(JSON.parse(req.body.vehicleData));
    models.vehicleHistoryData.collection.insertMany(JSON.parse(req.body.vehicleData), function(err, r) {
        if (err) {
            console.log(err);
        }
    });

    res.redirect('/');
});

module.exports = router;