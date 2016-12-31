var express = require('express');
var assert = require('assert');
var router = express.Router();

var vehicleController = require('../routers/vehicleRouter');

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/all', vehicleController.getVehicles);

router.post('/insert', vehicleController.insertVehicleHistory);

module.exports = router;