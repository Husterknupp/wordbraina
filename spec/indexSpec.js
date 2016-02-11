var index = require('./../index');

describe("index", function () {
    describe("initMatrix", function () {
        it("should instantiate fields properly", function () {
            var expectedValuesWithNeighbours = [
                [{ value: "a", neighbours: [], position: {x:0, y:0}},
                    { value: "f", neighbours: [], position: {x:1, y:0}}],
                [{ value: "e", neighbours: [], position: {x:1, y:1}} ]
            ];
            expect(index.initMatrix([
                ["a", "f"],
                ["", "e"]
            ])).toEqual(expectedValuesWithNeighbours);
        })
    })
});
