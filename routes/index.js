var express = require('express');
var assert = require('assert');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/vehicles');
var Schema = mongoose.Schema;

var vehicleDataSchema = new Schema({
    type: {type: String, required: true},
    geometry: {
        type: {type: String},
        coordinates: [Number],
    },
    properties: {
        title: String,
        icon: String
    }
}, {collection: 'vehicles'});

var vehicleHistoryDataSchema = new Schema({
    type: {type: String, required: true},
    geometry: {
        type: {type: String},
        coordinates: [Number],
    },
    properties: {
        title: String,
        icon: String
    }
}, {collection: 'vehiclesHistory'});

var vehicleData = mongoose.model('vehicleData', vehicleDataSchema);
var vehicleHistoryData = mongoose.model('vehicleHistoryData', vehicleHistoryDataSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
    vehicleData.find({}, {type:1, geometry:1, properties:1, _id:0})
        .then(function(doc) {
            res.render('index', {
                points: doc,
                title: 'Tracking App'
            });
        });
});

router.get('/update', function(req, res, next) {
    vehicleData.find({}, {type:1, geometry:1, properties:1, _id:0})
        .then(function(doc) {
            res.send(JSON.stringify(doc));
        });
});

router.post('/insert', function(req, res, next) {
    console.log(JSON.parse(req.body.vehicleData));
    //vehicleHistoryData.create(JSON.parse(req.body.vehicleData));
    //var data = new vehicleHistoryData(JSON.parse(req.body.vehicleData));
    //data.save();
    vehicleHistoryData.collection.insertMany(JSON.parse(req.body.vehicleData), function(err,r) {

    });


    res.redirect('/');
});

module.exports = router;