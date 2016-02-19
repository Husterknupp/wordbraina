var request = require("superagent"),
    _ = require("underscore");

var url = "localhost:5000/puzzles";
console.log("Posting payload to " + url);
request
    .post(url)
    .send({
        "lines": [
            ["a", "f"],
            ["f", "e"]]
    })
    .end(function(err, res) {
        if (res.statusCode !== 200) {
            throw "Wrong status code " + res.statusCode;
        }
        var puzzleId = res.text;
        console.log("Status code 200 - puzzle id: " + puzzleId);

        url = "localhost:5000/puzzles/" + puzzleId;
        console.log("Get puzzle from " + url);
        request
            .get(url)
            .end(function(err, res) {
                if (res.statusCode !== 200) {
                    throw "Wrong status code " + res.statusCode;
                }
                var expected = [
                    [{"value": "a", "x": 0, "y": 0}, {"value": "f", "x": 1, "y": 0}],
                    [{"value": "f", "x": 0, "y": 1}, {"value": "e", "x": 1, "y": 1}]];
                if (_.isEqual(res.text, expected)) {
                    throw "Puzzles not equal\n" +
                    "Expected: " + JSON.stringify(expected) + "\n" +
                    "Actual:   " + res.text;
                }
                console.log("Result is as expected.\n\nP U R F E C T !!\n");
            });
    });
