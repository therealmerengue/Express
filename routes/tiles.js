var express = require('express');
var router = express.Router();

var MBTiles = require('mbtiles');
var p = require("path");

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