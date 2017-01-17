var express = require('express');
var path = require('path');
var router = express.Router();

var vehicleRouter = require('../routers/vehicleRouter');

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../../public/views/page.html'));
});

router.get('/all', vehicleRouter.getVehicles);

router.post('/insert', vehicleRouter.insertVehicleHistory);

router.get('/info/:plate', vehicleRouter.getVehicle);

module.exports = router;