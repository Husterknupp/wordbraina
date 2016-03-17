'use strict';
var _ = require("underscore"),
    Path = require("./path").Path;

class Puzzle{
    constructor(lines, dictionary){
        this.dictionary = dictionary;
        this.init(lines);
        this.initNeighbours();
    }

    init(lines) {
        var rows = [];
        var y = 0;
        lines.forEach(function(line) {
            var x = 0;
            var newLine = [];
            line.forEach(function(letter) {
                if (letter.trim() !== "") {
                    newLine.push({value: letter.trim(), neighbours: [], x, y});
                }
                x++;
            });
            rows.push(newLine);
            y++;
        });
        this.rows = rows;
        this.rowCount = y;
    }

    findNeighbourInRow(row, x, y) {
        return _.find(row, function(field) {
            return field.x === x && field.y === y;
        });
    }

    addNeighbourIfPresent(field, neighbourX, neighbourY) {
        for (var i = 0; i < this.rows.length; i++) {
            var neighbour = this.findNeighbourInRow(this.rows[i], neighbourX, neighbourY);
            if (typeof neighbour !== "undefined") {
                field.neighbours.push(neighbour);
            }
        }
    }

    // todo refactor:
    // first collect all neighbours for the field
    // then add all neighbours at once
    addNeighboursDependingOnPosition(field) {
        this.addNeighbourIfPresent(field, field.x + 1, field.y);
        this.addNeighbourIfPresent(field, field.x, field.y + 1);
        this.addNeighbourIfPresent(field, field.x + 1, field.y + 1);
        if (field.x !== 0) {
            // also fields to the left
            this.addNeighbourIfPresent(field, field.x - 1, field.y);
            this.addNeighbourIfPresent(field, field.x - 1, field.y + 1);
        }
        if (field.y !== 0) {
            // also fields above
            this.addNeighbourIfPresent(field, field.x + 1, field.y - 1);
            this.addNeighbourIfPresent(field, field.x, field.y - 1);
        }
        if (field.x !== 0 && field.y !== 0) {
            // also upper left corner
            this.addNeighbourIfPresent(field, field.x - 1, field.y - 1);
        }
    }

    initNeighbours() {
        for (var i = 0; i < this.rowCount; i++) {
            var j = 0;
            while (this.rows[i][j]) {
                var field = this.rows[i][j];
                this.addNeighboursDependingOnPosition(field);
                j++;
            }
        }
    }

    walkToNeighbours(paths) {
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

    getFieldsAsPath() {
        var result = [];
        this.rows.forEach(function(row) {
            row.forEach(function(field) {
                result.push(new Path(field));
            })
        });
        return result;
    }

    findPossibleTokens(wordLength) {
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
    }

    findDictionaryWords(wordLength) {
        var token = this.findPossibleTokens(wordLength);
        var result = [];
        var dictionary = this.dictionary;
        token.forEach(function(token) {
            if (dictionary.indexOf(token.toLowerCase()) != -1
                && result.indexOf(token) == -1) {
                result.push(token);
            }
        });
        return result;
    };
}

module.exports = {Puzzle};
