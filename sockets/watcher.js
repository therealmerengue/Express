var socketIO = require('socket.io')();

var MongoOplog = require('mongo-oplog');
var oplog = MongoOplog('mongodb://localhost:27017/local', { ns: 'vehicles.vehicles' }).tail();
var models = require('../models/vehicle');

var sendChanged = function(doc) {
    var id = doc.o2._id;
    models.vehicleData.find({"_id": id}, {type:1, geometry:1, properties:1, _id:0})
        .then(function(data) {
            socketIO.emit('change', JSON.stringify(data));
        });
};

oplog.on('insert', function(doc) {
    console.log(doc);
    sendChanged(doc);
});

oplog.on('update', function(doc) {
    console.log(doc);
    sendChanged(doc);
});

oplog.on('delete', function(doc) {
    console.log(doc.o._id);
    sendChanged(doc);
});

oplog.on('error', function(error) {
    console.log(error);
});

oplog.on('end', function() {
    console.log('Stream ended');
});

oplog.stop(function() {
    console.log('server stopped');
});

module.exports = socketIO;