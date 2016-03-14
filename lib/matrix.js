var _ = require("underscore"),
    pathClass = require("./path");

var getFieldsAsPath = function() {
    var result = [];
    this.rows.forEach(function(row) {
        row.forEach(function(field) {
            result.push(pathClass(field));
        })
    });
    return result;
};

function findNeighbourInRow(row, x, y) {
    return _.find(row, function(field) {
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

// todo make it private
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

// todo make it private
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

// todo do we really need it publically: Cant it be tested by a test of a calling method?
var walkToNeighbours = function(paths) {
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
};

var findPossibleTokens = function(wordLength) {
    var noOfFields = 0;
    this.rows.forEach(function(row) {
        row.forEach(function() {
            noOfFields++;
        })
    });
    if (wordLength > noOfFields) {
        throw "wordLength must not be greater than number of matrix fields (" + noOfFields + ")";
    }

    var paths = this.getFieldsAsPath();
    var i = 1;
    while (i < wordLength) {
        paths = this.walkToNeighbours(paths);
        i++;
    }

    var result = [];
    paths.forEach(function(path) {
        result.push(path.concat());
    });
    return result;
};

var findDictionaryWords = function(wordLength, dictionary) {
    var token = this.findPossibleTokens(wordLength);
    var result = [];
    token.forEach(function(token) {
        if (dictionary.indexOf(token.toLowerCase()) != -1
            && result.indexOf(token) == -1) {
            result.push(token);
        }
    });
    return result;
};

// todo rename matrix class to puzzle
// todo have also dictionary as a dependency in matrix - pass in cstr
module.exports = function(lines) {
    var result = initMatrix(lines);
    return {
        rows: result.rows, rowCount: result.rowCount,
        initNeighbours, getFieldsAsPath, walkToNeighbours, findPossibleTokens, findDictionaryWords
    };
};

/*  THIS WORKS
    function Matrix(abc) {
        console.log(abc);
    }
    module.exports = { Matrix };
    var matrix = new _matrix.Matrix('def');
*/
