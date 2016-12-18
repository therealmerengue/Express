var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var vehicleObject = {
    type: {type: String, required: true},
    geometry: {
        type: {type: String},
        coordinates: [Number]
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
var vehicleHistoryDataSchema = new Schema(vehicleObject, {collection: 'history'});

var vehicleData = mongoose.model('vehicleData', vehicleDataSchema);
var vehicleHistoryData = mongoose.model('vehicleHistoryData', vehicleHistoryDataSchema);

module.exports = {
    vehicleData: vehicleData,
    vehicleHistoryData: vehicleHistoryData,
    selectObject: {type: 1, geometry: 1, properties: 1, _id: 1}
};
