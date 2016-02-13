var index = require("./../index"),
    _ = require("underscore");

describe("index", function () {
    describe("initMatrix", function () {
        it("should instantiate fields properly and ignore empty fields", function () {
            var expectedValuesWithNeighbours = {
                rows: [
                    [{value: "a", neighbours: [], x: 0, y: 0},
                        {value: "f", neighbours: [], x: 1, y: 0}],
                    [{value: "e", neighbours: [], x: 1, y: 1}]
                ], rowCount: 2
            };
            expect(index.initMatrix([
                ["a", "f"],
                ["", "e"]
            ])).toEqual(expectedValuesWithNeighbours);
        });

        it("should ignore white spaces", function () {
            var expectedValuesWithNeighbours = {
                rows: [
                    [{value: "f", neighbours: [], x: 1, y: 0}],
                    [{value: "e", neighbours: [], x: 1, y: 1}]
                ], rowCount: 2
            };
            expect(index.initMatrix([
                [" ", "f"],
                ["  ", "e"]
            ])).toEqual(expectedValuesWithNeighbours);
        });

        it("should handle empty matrix", function () {
            expect(index.initMatrix([])).toEqual({rows: [], rowCount: 0});
        });
    });

    describe("initNeighbours", function () {
        it("should put as neighbour each field left, right, below, above", function () {
            var matrix = {
                rows: [
                    [{value: "a", neighbours: [], x: 0, y: 0},
                        {value: "b", neighbours: [], x: 1, y: 0}],
                    [{value: "c", neighbours: [], x: 0, y: 1},
                        {value: "d", neighbours: [], x: 1, y: 1}]
                ], rowCount: 2
            };

            var neighbours = index.initNeighbours(matrix);

            var a = neighbours.rows[0][0];
            var b = _.find(a.neighbours, function (field) {
                return field.value === "b";
            });
            expect(b).toBeDefined();
            var c = _.find(a.neighbours, function (field) {
                return field.value === "c";
            });
            expect(c).toBeDefined();
            var d = _.find(a.neighbours, function (field) {
                return field.value === "d";
            });
            expect(d).toBeDefined();

            var a1 = _.find(b.neighbours, function (field) {
                return field.value === "a";
            });
            expect(a1).toBeDefined();
            var c1 = _.find(b.neighbours, function (field) {
                return field.value === "c";
            });
            expect(c1).toBeDefined();
            var d1 = _.find(b.neighbours, function (field) {
                return field.value === "d";
            });
            expect(d1).toBeDefined();
        });
        it("should not add field of next +1 row as neighbour", function () {
            var matrix = {
                rows: [
                    [{value: "a", neighbours: [], x: 0, y: 0}],
                    [],
                    [{value: "c", neighbours: [], x: 0, y: 2}]
                ], rowCount: 3
            };

            var neighbours = index.initNeighbours(matrix);
            var a = neighbours.rows[0][0];
            expect(a.neighbours).toEqual([]);
        });

        it("should not add field of same row, two right as neighbour", function () {
            var matrix = {
                rows: [
                    [{value: "a", neighbours: [], x: 0, y: 0},{value: "a", neighbours: [], x: 0, y: 2}]
                ], rowCount: 1
            };

            var neighbours = index.initNeighbours(matrix);
            var a = neighbours.rows[0][0];
            expect(a.neighbours).toEqual([]);
        });

    });
});
