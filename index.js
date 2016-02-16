var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    _ = require("underscore");

app.set("port", (process.env.PORT || 5000));
app.use(bodyParser.json());

app.listen(app.get("port"), function () { // heroku transparency
    console.log("Node app is running on port", app.get("port"));
});

app.get("/", function (req, res) {
    res.send("<h1>Hello, World!</h1>");
});

// todo return a real saved puzzle
app.get("/puzzles/:id", function (req, res) {
    res.send("puzzle " + req.params.id)
});

// todo implement word finding
app.get("/puzzles/:id/words", function (req, res) {
    res.send("puzzle " + req.params.id)
});

function findNeighbourInRow(row, x, y) {
    return _.find(row, function (field) {
        return field.x === x && field.y === y;
    });
}

function addNeighbourIfPresent(matrix, field, neighbourX, neighbourY) {
    for (var i = 0; i < matrix.rows.length; i++) {
        var neighbour = findNeighbourInRow(matrix.rows[i], neighbourX, neighbourY);
        if (typeof neighbour !== "undefined") {
            field.neighbours.push(neighbour);
        }
    }
}

function addNeighboursDependingOnPosition(field, matrix) {
    addNeighbourIfPresent(matrix, field, field.x + 1, field.y);
    addNeighbourIfPresent(matrix, field, field.x, field.y + 1);
    addNeighbourIfPresent(matrix, field, field.x + 1, field.y + 1);
    if (field.x !== 0) {
        // also fields to the left
        addNeighbourIfPresent(matrix, field, field.x - 1, field.y);
        addNeighbourIfPresent(matrix, field, field.x - 1, field.y + 1);
    }
    if (field.y !== 0) {
        // also fields above
        addNeighbourIfPresent(matrix, field, field.x + 1, field.y - 1);
        addNeighbourIfPresent(matrix, field, field.x, field.y - 1);
    }
    if (field.x !== 0 && field.y !== 0) {
        // also upper left corner
        addNeighbourIfPresent(matrix, field, field.x - 1, field.y - 1);
    }
}

var index = {
    // todo consider matrix as a class
    initMatrix: function initMatrix(lines) {
        var rows = [];
        var y = 0;
        _.forEach(lines, function (line) {
            var x = 0;
            var newLine = [];
            _.forEach(line, function (letter) {
                if (letter.trim() !== "") {
                    newLine.push({value: letter.trim(), neighbours: [], x: x, y: y});
                }
                x++;
            });
            rows.push(newLine);
            y++;
        });
        return {rows: rows, rowCount: y};
    },

    initNeighbours: function initNeighbours(matrix) {
        for (var i = 0; i < matrix.rowCount; i++) {
            var j = 0;
            while (matrix.rows[i][j]) {
                var field = matrix.rows[i][j];
                addNeighboursDependingOnPosition(field, matrix);
                j++;
            }
        }
        return matrix;
    }
};

// todo store the puzzle into ram with id
// todo return that id
app.post("/puzzles", function (req, res) {
    var matrix = index.initNeighbours(index.initMatrix(req.body.lines));
    var matrixNoNeighbours = _.map(matrix.rows, function (row) {
        return _.map(row, function (field) {
            return {value: field.value, x: field.x, y: field.y};
        });
    });
    res.send(matrixNoNeighbours);
});

module.exports = index;
