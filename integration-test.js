var request = require("superagent"),
    _ = require("underscore");

var url = "localhost:5000/puzzles";
console.log("Posting puzzle to " + url);
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

        // #1 ASSERT MATRIX WAS BUILT PROPERLY
        url = "localhost:5000/puzzles/" + puzzleId;
        console.log("[PUZZLE]: Get puzzle from " + url);
        request
            .get(url)
            .end(function(err, res) {
                if (res.statusCode !== 200) {
                    throw "[PUZZLE]: Wrong status code " + res.statusCode;
                }
                var expected = JSON.stringify([
                    [{"value": "a", "x": 0, "y": 0}, {"value": "f", "x": 1, "y": 0}],
                    [{"value": "f", "x": 0, "y": 1}, {"value": "e", "x": 1, "y": 1}]]);
                if (!_.isEqual(res.text, expected)) {
                    throw "[PUZZLE]: Puzzles not equal\n" +
                    "Expected: " + expected + "\n" +
                    "Actual:   " + res.text;
                }
                console.log("[PUZZLE]: Result is as expected. G O O D !!");
            });

        // #2 ASSERT WORDS ARE FOUND PROPERLY
        url = "localhost:5000/puzzles/" + puzzleId + "/words?length=4";
        console.log("[WORDS]: Get words from " + url);
        request
            .get(url)
            .end(function(err, res) {
                if (res.statusCode !== 200) {
                    throw "[WORDS]: Wrong status code " + res.statusCode;
                }
                var expected = JSON.stringify(["affe"]);
                if (!_.isEqual(res.text, expected)) {
                    throw "[WORDS]: Could not find word\n" +
                    "Expected: " + expected + "\n" +
                    "Actual:   " + res.text;
                }
                console.log("[WORDS]: Result is as expected.\n\nP U R F E C T !!\n");
            });
    });
