var _matrix = require("./../lib/matrix");
    _ = require("underscore");
describe("matrix", function() {
    describe("initMatrix", function() {
        it("should instantiate fields properly and ignore empty fields", function() {
            var expectedValuesWithNeighbours = {
                rows: [
                    [{value: "a", neighbours: [], x: 0, y: 0},
                        {value: "f", neighbours: [], x: 1, y: 0}],
                    [{value: "e", neighbours: [], x: 1, y: 1}]
                ], rowCount: 2
            };
            var actual = _matrix([
                ["a", "f"],
                ["", "e"]
            ]);
            expect(actual.rows).toEqual(expectedValuesWithNeighbours.rows);
            expect(actual.rowCount).toEqual(expectedValuesWithNeighbours.rowCount);
        });

        it("should ignore white spaces", function() {
            var expectedValuesWithNeighbours = {
                rows: [
                    [{value: "f", neighbours: [], x: 1, y: 0}],
                    [{value: "e", neighbours: [], x: 1, y: 1}]
                ], rowCount: 2
            };
            var actual = _matrix([
                [" ", "f"],
                ["  ", "e"]
            ]);
            expect(actual.rows).toEqual(expectedValuesWithNeighbours.rows);
            expect(actual.rowCount).toEqual(expectedValuesWithNeighbours.rowCount);
        });

        it("should handle empty matrix", function() {
            var actual = _matrix([]);
            expect(actual.rows).toEqual([]);
            expect(actual.rowCount).toEqual(0);
        });
    });

    describe("initNeighbours", function() {
        it("should put as neighbour each field left, right, below, above", function() {
            var actual = _matrix([]);
            actual.rows = [
                [{value: "a", neighbours: [], x: 0, y: 0},
                    {value: "b", neighbours: [], x: 1, y: 0}],
                [{value: "c", neighbours: [], x: 0, y: 1},
                    {value: "d", neighbours: [], x: 1, y: 1}]
            ];
            actual.rowCount = 2;
            actual.initNeighbours();

            var a = actual.rows[0][0];
            var b = _.find(a.neighbours, function(field) {
                return field.value === "b";
            });
            expect(b).toBeDefined();
            var c = _.find(a.neighbours, function(field) {
                return field.value === "c";
            });
            expect(c).toBeDefined();
            var d = _.find(a.neighbours, function(field) {
                return field.value === "d";
            });
            expect(d).toBeDefined();
            expect(_.find(a.neighbours, function(field) {
                return field.value === "a";
            })).toBeUndefined();

            var a1 = _.find(b.neighbours, function(field) {
                return field.value === "a";
            });
            expect(a1).toBeDefined();
            var c1 = _.find(b.neighbours, function(field) {
                return field.value === "c";
            });
            expect(c1).toBeDefined();
            var d1 = _.find(b.neighbours, function(field) {
                return field.value === "d";
            });
            expect(d1).toBeDefined();
        });

        it("should not add field of next +1 row as neighbour", function() {
            var actual = _matrix();
            actual.rows = [
                [{value: "a", neighbours: [], x: 0, y: 0}],
                [],
                [{value: "c", neighbours: [], x: 0, y: 2}]
            ];

            actual.initNeighbours();
            var a = actual.rows[0][0];
            expect(a.neighbours).toEqual([]);
        });

        it("should not add field of same row, two right as neighbour", function() {
            var actual = _matrix();
            actual.rows = [
                [{value: "a", neighbours: [], x: 0, y: 0}, {value: "a", neighbours: [], x: 0, y: 2}]
            ];
            actual.initNeighbours();
            var a = actual.rows[0][0];
            expect(a.neighbours).toEqual([]);
        });

    });

    describe("walkToNeighbours", function() {
        it("should create 12 paths", function() {
            var matrix = _matrix([["a", "b"], ["c", "d"]]);
            matrix.initNeighbours();
            var initialPaths = matrix.getFieldsAsPath();

            var newPaths = matrix.walkToNeighbours(initialPaths);

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
            var matrix = _matrix([["a", "l"], ["k", "o"]]);
            matrix.initNeighbours();

            var possibleTokens = matrix.findPossibleTokens(4);
            // [ 'a', 'l', 'k', 'o' ] => [ "alok", "alko", "akol", "aklo", "a.. ]
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
            var matrix = _matrix([["s", "p"], ["a", "ß"]]);
            matrix.initNeighbours();

            var dictionaryWords = matrix.findDictionaryWords(4, ["baum", "kiffer", "ast", "spaß"]);
            expect(dictionaryWords).toContain("spaß");
            expect(dictionaryWords.length).toEqual(1);

            dictionaryWords = matrix.findDictionaryWords(4, ["baum", "kiffer", "ast"]);
            expect(dictionaryWords).not.toContain("spaß");
            expect(dictionaryWords.length).toEqual(0);

            dictionaryWords = matrix.findDictionaryWords(3, ["aps", "kiffer", "ast", "spaß"]);
            expect(dictionaryWords).toContain("aps");
            expect(dictionaryWords.length).toEqual(1);
        });

        it("should not be case sensitive", function() {
            var Spaß = _matrix([["S", "p"], ["a", "ß"]]);
            Spaß.initNeighbours();
            dictionaryWords = Spaß.findDictionaryWords(4, ["spaß"]);
            expect(dictionaryWords.length).toEqual(1);
            expect(dictionaryWords).toContain("Spaß");

            var SPAß = _matrix([["S", "P"], ["A", "ß"]]);
            SPAß.initNeighbours();
            var dictionaryWords = SPAß.findDictionaryWords(4, ["spaß"]);
            expect(dictionaryWords).toContain("SPAß");
            expect(dictionaryWords.length).toEqual(1);

            var spaß = _matrix([["s", "p"], ["a", "ß"]]);
            spaß.initNeighbours();
            dictionaryWords = spaß.findDictionaryWords(4, ["spaß"]);
            expect(dictionaryWords).toContain("spaß");
            expect(dictionaryWords.length).toEqual(1);
        });
    });
});
