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

    describe("findDictionaryWords", function() {
        it("should find \'spaß\'", function() {
            var matrix = matrixClass([["s", "p"], ["a", "ß"]]);
            matrix.initNeighbours();

            var dictionaryWords = app.findDictionaryWords(matrix, 4, ["baum", "kiffer", "ast", "spaß"]);
            expect(dictionaryWords).toContain("spaß");
            expect(dictionaryWords.length).toEqual(1);

            dictionaryWords = app.findDictionaryWords(matrix, 4, ["baum", "kiffer", "ast"]);
            expect(dictionaryWords).not.toContain("spaß");
            expect(dictionaryWords.length).toEqual(0);

            dictionaryWords = app.findDictionaryWords(matrix, 3, ["aps", "kiffer", "ast", "spaß"]);
            expect(dictionaryWords).toContain("aps");
            expect(dictionaryWords.length).toEqual(1);
        });

        it("should not be case sensitive", function() {
            var Spaß = matrixClass([["S", "p"], ["a", "ß"]]);
            Spaß.initNeighbours();
            dictionaryWords = app.findDictionaryWords(Spaß, 4, ["spaß"]);
            expect(dictionaryWords.length).toEqual(1);
            expect(dictionaryWords).toContain("Spaß");

            var SPAß = matrixClass([["S", "P"], ["A", "ß"]]);
            SPAß.initNeighbours();
            var dictionaryWords = app.findDictionaryWords(SPAß, 4, ["spaß"]);
            expect(dictionaryWords).toContain("SPAß");
            expect(dictionaryWords.length).toEqual(1);

            var spaß = matrixClass([["s", "p"], ["a", "ß"]]);
            spaß.initNeighbours();
            dictionaryWords = app.findDictionaryWords(spaß, 4, ["spaß"]);
            expect(dictionaryWords).toContain("spaß");
            expect(dictionaryWords.length).toEqual(1);
        });
    });
});
