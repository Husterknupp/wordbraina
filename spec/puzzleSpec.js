/*global describe:false, it:false, expect:false*/
"use strict";
var Puzzle = require("./../lib/puzzle").Puzzle,
    _ = require("underscore");

describe("Puzzle", function() {
    describe("initialization", function() {
        it("should instantiate fields properly and ignore empty fields", function() {
            var expectedValuesWithNeighbours = {
                rows: [
                    [{value: "a", neighbours: [], x: 0, y: 0},
                        {value: "f", neighbours: [], x: 1, y: 0}],
                    [{value: "e", neighbours: [], x: 1, y: 1}]
                ], rowCount: 2
            };

            var actual = new Puzzle([
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

            var actual = new Puzzle([
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

        it("should handle empty puzzle", function() {
            var actual = new Puzzle([]);
            expect(actual.rows).toEqual([]);
            expect(actual.rowCount).toEqual(0);
        });

        it("should put as neighbour each field left, right, below, above", function() {
            var actual = new Puzzle([
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
            var actual = new Puzzle([
                ["a"],
                [],
                ["c"]
            ]);

            actual.initNeighbours(); // todo remove?
            var a = actual.rows[0][0];
            expect(a.neighbours).toEqual([]);
        });

        it("should not add field of same row, two right as neighbour", function() {
            var actual = new Puzzle([
                ["a", "", "a"]
            ]);
            var a = actual.rows[0][0];
            expect(a.neighbours).toEqual([]);
        });

    });

    describe("findPossibleTokens", function() {
        it("should find expected tokens for a 2 x 2 puzzle", function() {
            var puzzle = new Puzzle([["a", "l"], ["k", "o"]]);

            var possibleTokens = puzzle.findPossibleTokens(4);
            var possibleTokensAsSet = new Set(possibleTokens);

            expect(possibleTokens.length).toEqual(4 * 6);
            expect(possibleTokensAsSet).toEqual(new Set([
                "alok", "alko", "akol", "aklo", "aokl", "aolk",
                "lako", "laok", "loka", "loak", "lkoa", "lkao",
                "kola", "koal", "kalo", "kaol", "klao", "kloa",
                "okal", "okla", "olak", "olka", "oalk", "oakl"]));
            expect(possibleTokensAsSet.size).toEqual(possibleTokens.length);


            expect(puzzle.findPossibleTokens(2).length).toEqual(4 * 3);
        });

        it("should exclude duplicates", function() {
            var puzzle = new Puzzle([["a", "a"], ["b", "b"]]);
            var tokens = puzzle.findPossibleTokens(2);
            expect(tokens).toEqual(["aa", "ab", "bb", "ba"]);
        });
    });

    describe("findDictionaryWords", function() {
        it("should find \'spaß\'", function() {
            var puzzle = new Puzzle([["s", "p"], ["a", "ß"]], {"baum": null, "kiffer": null, "ast": null, "spaß": null});
            var dictionaryWords = puzzle.findDictionaryWords(4);
            expect(dictionaryWords).toContain("spaß");
            expect(dictionaryWords.length).toEqual(1);

            puzzle = new Puzzle([["s", "p"], ["a", "ß"]], {"baum": null, "kiffer": null, "ast": null});
            dictionaryWords = puzzle.findDictionaryWords(4);
            expect(dictionaryWords).not.toContain("spaß");
            expect(dictionaryWords.length).toEqual(0);

            puzzle = new Puzzle([["s", "p"], ["a", "ß"]], {"aps": null, "kiffer": null, "ast": null, "spaß": null});
            dictionaryWords = puzzle.findDictionaryWords(3);
            expect(dictionaryWords).toContain("aps");
            expect(dictionaryWords.length).toEqual(1);
        });

        it("should not be case sensitive", function() {
            var Spaß = new Puzzle([["S", "p"], ["a", "ß"]], {"spaß": null});
            var dictionaryWords = Spaß.findDictionaryWords(4);
            expect(dictionaryWords.length).toEqual(1);
            expect(dictionaryWords).toContain("Spaß");

            var SPAß = new Puzzle([["S", "P"], ["A", "ß"]], {"spaß": null});
            dictionaryWords = SPAß.findDictionaryWords(4);
            expect(dictionaryWords).toContain("SPAß");
            expect(dictionaryWords.length).toEqual(1);

            var spaß = new Puzzle([["s", "p"], ["a", "ß"]], {"spaß": null});
            dictionaryWords = spaß.findDictionaryWords(4);
            expect(dictionaryWords).toContain("spaß");
            expect(dictionaryWords.length).toEqual(1);
        });
    });
});
