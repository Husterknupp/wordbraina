var app = require('./../index.js'),
    matrixClass = require('./../lib/matrix');

describe('index', function() {
    describe('walkToNeighbours', function() {
        it('should create 12 paths', function() {
            var matrix = matrixClass([["a", "b"], ["c", "d"]]);
            matrix.initNeighbours();
            var initialPaths = matrix.getFieldsAsPath();

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

