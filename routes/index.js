var express = require('express');
var assert = require('assert');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/vehicles');
var Schema = mongoose.Schema;

var MBTiles = require('mbtiles');
var p = require("path");

var vehicleObject = {
    type: {type: String, required: true},
    geometry: {
        type: {type: String},
        coordinates: [Number],
    },
    properties: {
        title: String,
        icon: String,
        speed: Number,
        distance: Number,
        plate: {type: String, required: true},
        date: Date
    }
}

var vehicleDataSchema = new Schema(vehicleObject, {collection: 'vehicles'});
var vehicleHistoryDataSchema = new Schema(vehicleObject, {collection: 'vehiclesHistory'});

var vehicleData = mongoose.model('vehicleData', vehicleDataSchema);
var vehicleHistoryData = mongoose.model('vehicleHistoryData', vehicleHistoryDataSchema);

var selectObject = {type:1, geometry:1, properties:1, _id:0};

/* GET home page. */
router.get('/', function(req, res, next) {
    vehicleData.find({}, selectObject)
        .then(function(doc) {
            res.render('index', {
                points: doc,
                title: 'Tracking App'
            });
        });
});

router.get('/update', function(req, res, next) {
    vehicleData.find({}, selectObject)
        .then(function(doc) {
            res.send(JSON.stringify(doc));
        });
});

router.get('/info/:plate', function(req, res, next) {
    var plate = req.params.plate;
    var vehicle = {};
    console.log(plate);
    vehicleData.find({'properties.plate': plate}, selectObject)
        .then(function(doc) {
            vehicle.current = doc;
            vehicleHistoryData.find({'properties.plate': plate}, selectObject)
                .then(function(doc) {
                    vehicle.history = doc;
                    res.send(JSON.stringify(vehicle));
                });
        });
});

router.post('/insert', function(req, res, next) {
    console.log(JSON.parse(req.body.vehicleData));
    vehicleHistoryData.collection.insertMany(JSON.parse(req.body.vehicleData), function(err, r) {
        if (err) {
            console.log(err);
        }
    });

    res.redirect('/');
});

// path to the mbtiles; default is the server.js directory
var tilesDir = __dirname;

// Set return header
function getContentType(t) {
    var header = {};

    // CORS
    header["Access-Control-Allow-Origin"] = "*";
    header["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept";

    // Cache
    //header["Cache-Control"] = "public, max-age=2592000";

    // request specific headers
    if (t === "png") {
        header["Content-Type"] = "image/png";
    }
    if (t === "jpg") {
        header["Content-Type"] = "image/jpeg";
    }
    if (t === "pbf") {
        header["Content-Type"] = "application/x-protobuf";
        header["Content-Encoding"] = "gzip";
    }

    return header;
}

// tile cannon
router.get('/:s/:z/:x/:y.:t', function(req, res) {
    new MBTiles(p.join(tilesDir, 'planet.mbtiles'), function(err, mbtiles) {
        mbtiles.getTile(req.params.z, req.params.x, req.params.y, function(err, tile, headers) {
            if (err) {
                res.set({"Content-Type": "text/plain"});
                res.status(404).send('Tile rendering error: ' + err + '\n');
            } else {
                res.set(getContentType(req.params.t));
                res.send(tile);
            }
        });
        if (err) console.log("error opening database");
    });
});

module.exports = router;