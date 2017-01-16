var express = require("express"),
    app = express(),
    MBTiles = require('mbtiles'),
    p = require("path");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static(p.join(__dirname, 'map')));
var tilesDir = __dirname;

// Set return header
function getContentType(t) {
    var header = {};

    // Cache
    header["Cache-Control"] = "public, max-age=2592000";

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
app.get('/:s/:z/:x/:y.:t', function(req, res) {
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

console.log('Listening on port: ' + 3000);
app.listen(3000);