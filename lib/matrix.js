var _ = require("underscore");

var getFields = function() {
    var result = [];
    this.rows.forEach(function(row) {
        row.forEach(function(field) {
            result.push(field);
        })
    });
    return result;
};

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

var initNeighbours = function() {
    for (var i = 0; i < this.rowCount; i++) {
        var j = 0;
        while (this.rows[i][j]) {
            var field = this.rows[i][j];
            addNeighboursDependingOnPosition(field, this);
            j++;
        }
    }
};

var initMatrix = function initMatrix(lines) {
    var rows = [];
    var y = 0;
    _.forEach(lines, function(line) {
        var x = 0;
        var newLine = [];
        _.forEach(line, function(letter) {
            if (letter.trim() !== "") {
                newLine.push({value: letter.trim(), neighbours: [], x, y});
            }
            x++;
        });
        rows.push(newLine);
        y++;
    });
    return {rows, rowCount: y};
};

module.exports = function(lines) {
    var result = initMatrix(lines);
    return {
        rows: result.rows, rowCount: result.rowCount, initNeighbours, getFields
    };
};
