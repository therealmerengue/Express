var express = require('express');
var assert = require('assert');
var router = express.Router();

var vehicleRouter = require('../routers/vehicleRouter');

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/all', vehicleRouter.getVehicles);

router.post('/insert', vehicleRouter.insertVehicleHistory);

module.exports = router;