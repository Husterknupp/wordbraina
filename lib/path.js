"use strict";
var _ = require("underscore");

class Path {
    constructor(headField) {
        this.path = [headField];
    }

    tail() {
        var pathLength = this.path.length;
        // returns a Field
        return this.path[pathLength - 1];
    }

    walkToIfUnknown(neighbour) {
        if (typeof _.findWhere(this.path, {x: neighbour.x, y: neighbour.y}) === "undefined") {
            return this.to(neighbour);
        } else {
            return null;
        }
    }

    to(newNeighbour) {
        var result = new Path();
        result.path = _.clone(this.path);
        result.path.push(newNeighbour);
        return result;
    }

    concat() {
        return _.reduce(this.path, function(memo, field) {
            return memo + field.value;
        }, "");
    }
}
module.exports = {Path};
