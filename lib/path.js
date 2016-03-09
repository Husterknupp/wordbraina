var _ = require("underscore");

module.exports = function(headField) {
    return {
        path: [headField],
        tail() {
            var pathLength = this.path.length;
            // returns a Field
            return this.path[pathLength - 1];
        },
        walkToIfUnknown(neighbour) {
            if (typeof _.findWhere(this.path, {x: neighbour.x, y: neighbour.y}) === "undefined") {
                return this.to(neighbour);
            } else {
                return null;
            }
        },
        to(newNeighbour) {
            var result = _.clone(this);
            var newPath = _.clone(this.path);
            newPath.push(newNeighbour);
            result.path = newPath;
            return result;
        },
        concat(){
            return _.reduce(this.path, function(memo, field) {
                return memo + field.value;
            }, '')
        }
    };
};
