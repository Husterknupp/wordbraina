var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    _ = require("underscore"),
    uuid = require("uuid"),
    matrixClass = require("./lib/matrix"),
    puzzles = {};

app.set("port", (process.env.PORT || 5000));
app.use(bodyParser.json());

app.listen(app.get("port"), function () { // heroku transparency
    console.log("Node app is running on port", app.get("port"));
});

app.get("/", function (req, res) {
    res.send("<h1>Hello, World!</h1>");
});

app.get("/puzzles/:id", function (req, res) {
    if (!puzzles.hasOwnProperty(req.params.id)) {
        res.status(404).send("no puzzle for id " + req.params.id);
        return;
    }
    var matrix = puzzles[req.params.id];
    var matrixNoNeighbours = _.map(matrix.rows, function (row) {
        return _.map(row, function (field) {
            return {value: field.value, x: field.x, y: field.y};
        });
    });
    res.send(matrixNoNeighbours);
});

app.post("/puzzles", function (req, res) {
    var matrix = matrixClass(req.body.lines);
    matrix.initNeighbours();
    var id = uuid.v1();
    puzzles[id] = matrix;
    res.send(id);
});

// todo implement word finding
app.get("/puzzles/:id/words", function (req, res) {
    res.send("puzzle " + req.params.id);
});

function walkToNeighbours(paths) {
    var result = new Set();
    paths.forEach(function(path) {
        path.tail().neighbours.forEach(function(neighbour) {
            var newPath = path.walkToIfUnknown(neighbour);
            if (newPath !== null) {
                result.add(newPath);
            }
        });
    });
    return result;
}

function findPossibleTokens(matrix, wordLength) {
    var noOfFields = 0;
    matrix.rows.forEach(function(row) {
        row.forEach(function(field) {
            noOfFields++;
        })
    });
    if (wordLength > noOfFields) {
        throw "wordLength must not be greater than number of matrix fields (" + noOfFields + ")";
    }

    var paths = matrix.getFieldsAsPath();
    var i = 1;
    while (i < wordLength) {
        paths = walkToNeighbours(paths);
        i++;
    }
    var result = [];
    paths.forEach(function(path) {
        result.push(path.concat());
    });
    return result;
}

exports.walkToNeighbours = walkToNeighbours;
exports.findPossibleTokens = findPossibleTokens;
