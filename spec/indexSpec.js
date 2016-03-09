var app = require("./../index.js"),
    matrixClass = require("./../lib/matrix");

describe("index", function() {
    describe("walkToNeighbours", function() {
        it("should create 12 paths", function() {
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
    });

    describe("findPossibleTokens", function() {
        it("should find expected tokens for a 2 x 2 matrix", function() {
            var matrix = matrixClass([["a", "l"], ["k", "o"]]);
            matrix.initNeighbours();

            var possibleTokens = app.findPossibleTokens(matrix, 4);
            var possibleTokensAsSet = new Set(possibleTokens);

            expect(possibleTokens.length).toEqual(4 * 6);
            expect(possibleTokensAsSet).toEqual(new Set([
                "alok", "alko", "akol", "aklo", "aokl", "aolk",
                "lako", "laok", "loka", "loak", "lkoa", "lkao",
                "kola", "koal", "kalo", "kaol", "klao", "kloa",
                "okal", "okla", "olak", "olka", "oalk", "oakl"]));
            expect(possibleTokensAsSet.size).toEqual(possibleTokens.length);
        });
    });
});

