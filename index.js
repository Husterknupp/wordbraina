var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    _ = require("underscore");

app.set("port", (process.env.PORT || 5000));
app.use(bodyParser.json());

// todo can this be removed? Or is it used by heroku?
app.listen(app.get("port"), function () {
    console.log("Node app is running on port", app.get("port"));
});

app.get("/", function (req, res) {
    res.send("<h1>Hello, World!</h1>");
});

app.post("/puzzles", function (req, res) {
    //req.body.lines;
    //var matrix = initMatrix(req.body.lines);
    res.send("matrix initialized and neighbours found\n");

    //res.json(req.body);
    //res.setHeader('Content-Type', 'application/json')
    //res.write('you posted:\n');
    //console.log(req.method);
    //res.end(JSON.stringify(req.body, null, 2));
    //res.end('d');
});

exports.initMatrix = function (lines) {
    var rows = [];
    var y = 0;
    _.forEach(lines, function (line) {
        var x = 0;
        var newLine = [];
        _.forEach(line, function (letter) {
            if (letter.trim() !== "") {
                //newLine.push(new Field(letter.trim(), x, y));
                newLine.push({value: letter.trim(), neighbours: [], x: x, y: y});
            }
            x++;
        });
        rows.push(newLine);
        y++;
    });
    return {rows: rows, rowCount: y};
};

function findNeighbourInRow(row, x, y) {
    return _.find(row, function (field) {
        return field.x === x && field.y === y;
    });
}

function addNeighbourIfPresent (matrix, field, neighbourX, neighbourY) {
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

// todo consider matrix as a class
exports.initNeighbours = function (matrix) {
    for (var i = 0; i < matrix.rowCount; i++) {
        var j = 0;
        while (matrix.rows[i][j]) {
            var field = matrix.rows[i][j];
            addNeighboursDependingOnPosition(field, matrix);
            j++;
        }
    }
    return matrix;
};
