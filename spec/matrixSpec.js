var matrix = require("./../lib/matrix");
    _ = require("underscore");

describe("initMatrix", function () {
    it("should instantiate fields properly and ignore empty fields", function () {
        var expectedValuesWithNeighbours = {
            rows: [
                [{value: "a", neighbours: [], x: 0, y: 0},
                    {value: "f", neighbours: [], x: 1, y: 0}],
                [{value: "e", neighbours: [], x: 1, y: 1}]
            ], rowCount: 2
        };
        var actual = matrix([
            ["a", "f"],
            ["", "e"]
        ]);
        expect(actual.rows).toEqual(expectedValuesWithNeighbours.rows);
        expect(actual.rowCount).toEqual(expectedValuesWithNeighbours.rowCount);
    });

    it("should ignore white spaces", function () {
        var expectedValuesWithNeighbours = {
            rows: [
                [{value: "f", neighbours: [], x: 1, y: 0}],
                [{value: "e", neighbours: [], x: 1, y: 1}]
            ], rowCount: 2
        };
        var actual = matrix([
            [" ", "f"],
            ["  ", "e"]
        ]);
        expect(actual.rows).toEqual(expectedValuesWithNeighbours.rows);
        expect(actual.rowCount).toEqual(expectedValuesWithNeighbours.rowCount);
    });

    it("should handle empty matrix", function () {
        var actual = matrix([]);
        expect(actual.rows).toEqual([]);
        expect(actual.rowCount).toEqual(0);
    });
});

describe("initNeighbours", function () {
    it("should put as neighbour each field left, right, below, above", function () {
        var actual = matrix([]);
        actual.rows = [
            [{value: "a", neighbours: [], x: 0, y: 0},
                {value: "b", neighbours: [], x: 1, y: 0}],
            [{value: "c", neighbours: [], x: 0, y: 1},
                {value: "d", neighbours: [], x: 1, y: 1}]
        ];
        actual.rowCount = 2;
        actual.initNeighbours();

        var a = actual.rows[0][0];
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
        var actual = matrix();
        actual.rows = [
            [{value: "a", neighbours: [], x: 0, y: 0}],
            [],
            [{value: "c", neighbours: [], x: 0, y: 2}]
        ];

        actual.initNeighbours();
        var a = actual.rows[0][0];
        expect(a.neighbours).toEqual([]);
    });

    it("should not add field of same row, two right as neighbour", function () {
        var actual = matrix();
        actual.rows = [
            [{value: "a", neighbours: [], x: 0, y: 0}, {value: "a", neighbours: [], x: 0, y: 2}]
        ];
        actual.initNeighbours();
        var a = actual.rows[0][0];
        expect(a.neighbours).toEqual([]);
    });

});
