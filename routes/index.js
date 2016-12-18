var express = require('express');
var assert = require('assert');
var router = express.Router();

var tileController = require('../controllers/tileController');
var vehicleController = require('../controllers/vehicleController');

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/all', vehicleController.getVehicles);

router.post('/insert', vehicleController.insertVehicleHistory);

router.get('/:s/:z/:x/:y.:t', tileController.getTile);

module.exports = router;