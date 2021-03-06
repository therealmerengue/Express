var socketIO = require('socket.io')();

var MongoOplog = require('mongo-oplog');
var oplog = MongoOplog('mongodb://localhost:27017/local', {
    ns: 'vehicles.vehicles'
}).tail();

var models = require('../models/vehicle');

oplog.on('insert', function(doc) {
    console.log(doc);
    socketIO.emit('insert', doc.o);
});

oplog.on('update', function(doc) {
    console.log(doc);
    var id = doc.o2._id;
    models.vehicleData.find({"_id": id}, models.selectObject)
        .then(function(data) {
            socketIO.emit('change', JSON.stringify(data));
        });
});

oplog.on('delete', function(doc) {
    console.log(doc);
    socketIO.emit('delete', doc.o);
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