"use strict";
var Path = require("./../lib/path").Path;

describe("path to", function() {
    it("should ad an additional field to the path to the end", function() {
        var path = new Path({a: 1});
        expect(path.path).toEqual([{a: 1}]);
        expect(path.to({b: 2}).path).toEqual([{a: 1}, {b: 2}]);
    });

    it("should not modify original path", function() {
        var path = new Path({a: 1});
        expect(path.path).toEqual([{a: 1}]);
        path.to({b: 2});
        expect(path.path).toEqual([{a: 1}]);
    });

    it("should return class Path", function() {
        var path = new Path({a: 1});
        expect(path.constructor.name).toEqual("Path");
        var to = path.to({b: 2});
        expect(to.constructor.name).toEqual("Path");
    });
});
