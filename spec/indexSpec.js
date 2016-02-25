var app = require('./../index.js'),
    matrixClass = require('./../lib/matrix');

describe('index', function() {
    describe('walkToNeighbours', function() {
        it('should create 12 paths', function() {
            var matrix = matrixClass([["a", "b"], ["c", "d"]]);
            matrix.initNeighbours();
            var fields = matrix.getFields();

            var initialPaths = _.map(fields, function(field) {
                var result = {
                    path: [],
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
                };
                result.path.push(field);
                return result;
            });

            var newPaths = app.walkToNeighbours(initialPaths);

            expect(newPaths.size).toEqual(12);
            newPaths.forEach(function(path) {
                expect(path.path.length).toEqual(2);
            });
            var startingFromA = [];
            newPaths.forEach(function(path) {
                if (path.path[0].value === "a") {
                    startingFromA.push(path);
                }
            });
            expect(startingFromA.length).toEqual(3);
        });
    })
});

