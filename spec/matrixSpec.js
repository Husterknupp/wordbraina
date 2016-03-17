'use strict';
var Matrix = require("./../lib/puzzle").Puzzle;
_ = require("underscore");

describe("matrix", function() {
    describe("initialization", function() {
        it("should instantiate fields properly and ignore empty fields", function() {
            var expectedValuesWithNeighbours = {
                rows: [
                    [{value: "a", neighbours: [], x: 0, y: 0},
                        {value: "f", neighbours: [], x: 1, y: 0}],
                    [{value: "e", neighbours: [], x: 1, y: 1}]
                ], rowCount: 2
            };

            var actual = new Matrix([
                ["a", "f"],
                ["", "e"]
            ]);
            actual.rows = _.map(actual.rows, function(row) {
                row.forEach(function(field) {
                    field.neighbours = [];
                });
                return row;
            });

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

            var actual = new Matrix([
                [" ", "f"],
                ["  ", "e"]
            ]);
            actual.rows = _.map(actual.rows, function(row) {
                row.forEach(function(field) {
                    field.neighbours = [];
                });
                return row;
            });

            expect(actual.rows).toEqual(expectedValuesWithNeighbours.rows);
            expect(actual.rowCount).toEqual(expectedValuesWithNeighbours.rowCount);
        });

        it("should handle empty matrix", function() {
            var actual = new Matrix([]);
            expect(actual.rows).toEqual([]);
            expect(actual.rowCount).toEqual(0);
        });

        it("should put as neighbour each field left, right, below, above", function() {
            var actual = new Matrix([
                ["a", "b"],
                ["c", "d"]
            ]);

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
            var actual = new Matrix([
                ["a"],
                [],
                ["c"]
            ]);

            actual.initNeighbours(); // todo remove?
            var a = actual.rows[0][0];
            expect(a.neighbours).toEqual([]);
        });

        it("should not add field of same row, two right as neighbour", function() {
            var actual = new Matrix([
                ["a", "", "a"]
            ]);
            var a = actual.rows[0][0];
            expect(a.neighbours).toEqual([]);
        });

    });

    describe("findPossibleTokens", function() {
        it("should find expected tokens for a 2 x 2 matrix", function() {
            var matrix = new Matrix([["a", "l"], ["k", "o"]]);

            var possibleTokens = matrix.findPossibleTokens(4);
            var possibleTokensAsSet = new Set(possibleTokens);

            expect(possibleTokens.length).toEqual(4 * 6);
            expect(possibleTokensAsSet).toEqual(new Set([
                "alok", "alko", "akol", "aklo", "aokl", "aolk",
                "lako", "laok", "loka", "loak", "lkoa", "lkao",
                "kola", "koal", "kalo", "kaol", "klao", "kloa",
                "okal", "okla", "olak", "olka", "oalk", "oakl"]));
            expect(possibleTokensAsSet.size).toEqual(possibleTokens.length);


            expect(matrix.findPossibleTokens(2).length).toEqual(4 * 3);
        });
    });

    describe("findDictionaryWords", function() {
        it("should find \'spaß\'", function() {
            var matrix = new Matrix([["s", "p"], ["a", "ß"]], ["baum", "kiffer", "ast", "spaß"]);
            var dictionaryWords = matrix.findDictionaryWords(4);
            expect(dictionaryWords).toContain("spaß");
            expect(dictionaryWords.length).toEqual(1);

            matrix = new Matrix([["s", "p"], ["a", "ß"]], ["baum", "kiffer", "ast"]);
            dictionaryWords = matrix.findDictionaryWords(4);
            expect(dictionaryWords).not.toContain("spaß");
            expect(dictionaryWords.length).toEqual(0);

            matrix = new Matrix([["s", "p"], ["a", "ß"]], ["aps", "kiffer", "ast", "spaß"]);
            dictionaryWords = matrix.findDictionaryWords(3);
            expect(dictionaryWords).toContain("aps");
            expect(dictionaryWords.length).toEqual(1);
        });

        it("should not be case sensitive", function() {
            var Spaß = new Matrix([["S", "p"], ["a", "ß"]], ["spaß"]);
            dictionaryWords = Spaß.findDictionaryWords(4);
            expect(dictionaryWords.length).toEqual(1);
            expect(dictionaryWords).toContain("Spaß");

            var SPAß = new Matrix([["S", "P"], ["A", "ß"]], ["spaß"]);
            var dictionaryWords = SPAß.findDictionaryWords(4);
            expect(dictionaryWords).toContain("SPAß");
            expect(dictionaryWords.length).toEqual(1);

            var spaß = new Matrix([["s", "p"], ["a", "ß"]], ["spaß"]);
            dictionaryWords = spaß.findDictionaryWords(4);
            expect(dictionaryWords).toContain("spaß");
            expect(dictionaryWords.length).toEqual(1);
        });
    });
});
