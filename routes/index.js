var express = require('express');
var assert = require('assert');
var router = express.Router();

var tileController = require('../controllers/tileController');
var vehicleController = require('../controllers/vehicleController');

router.get('/', vehicleController.getVehicles);

router.get('/info/:plate', vehicleController.getVehicle);

router.post('/insert', vehicleController.insertVehicleHistory);

router.get('/:s/:z/:x/:y.:t', tileController.getTile);

module.exports = router;