var express = require('express');
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var router = express.Router();
var url = 'mongodb://localhost:27017/vehicles';

/* GET home page. */
router.get('/', function(req, res, next) {
  var vehicles = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('vehicles').find({}, {type:1, geometry:1, properties:1, _id:0});
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      vehicles.push(doc);
    }, function() {
      db.close();
      res.render('index', {
        points: vehicles,
        title: 'Tracking App'
      });
    });
  });
});

router.get('/update', function(req, res, next) {
  var vehicles = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('vehicles').find({}, {type:1, geometry:1, properties:1, _id:0});
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      vehicles.push(doc);
    }, function() {
      db.close();
      res.send(JSON.stringify(vehicles));
    });
  });
});


module.exports = router;
