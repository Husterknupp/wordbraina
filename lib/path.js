var _ = require("underscore");

module.exports = function(headField) {
    return {
        path: [headField],
        tail: function() {
            var pathLength = this.path.length;
            // returns a Field
            return this.path[pathLength - 1];
        },
        walkToIfUnknown: function(neighbour) {
            if (typeof _.findWhere(this.path, {x: neighbour.x, y: neighbour.y}) === 'undefined') {
                return this.to(neighbour);
            } else {
                return null;
            }
        },
        to: function(newNeighbour) {
            var result = _.clone(this);
            var newPath = _.clone(this.path);
            newPath.push(newNeighbour);
            result.path = newPath;
            return result;
        }
    }
};
