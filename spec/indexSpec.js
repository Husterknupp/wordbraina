var index = require('./../index');

describe("index.hello", function () {
    it("should say world", function () {
        expect(index.hello()).toEqual("world");
    });
});
