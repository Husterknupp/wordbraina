var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    _ = require("underscore"),
    uuid = require("uuid"),
    readline = require("readline"),
    fs = require("fs"),
    matrixClass = require("./lib/matrix"),
    puzzles = {};

var rl = readline.createInterface({
    input: fs.createReadStream('dictionary-de')
});

var dictionary = [];
rl.on('line', word => {
    dictionary.push(word.toLowerCase());
});

app.set("port", (process.env.PORT || 5000));
app.use(bodyParser.json());

app.listen(app.get("port"), function () { // heroku transparency
    console.log("Node app is running on port", app.get("port"));
});

app.get("/", function (req, res) {
    res.send("<h1>Hello, World!</h1>");
});

app.get("/puzzles/:id", function (req, res) {
    if (!puzzles.hasOwnProperty(req.params.id)) {
        res.status(404).send("no puzzle for id " + req.params.id);
        return;
    }
    var matrix = puzzles[req.params.id];
    var matrixNoNeighbours = _.map(matrix.rows, function (row) {
        return _.map(row, function (field) {
            return {value: field.value, x: field.x, y: field.y};
        });
    });
    res.send(matrixNoNeighbours);
});

app.post("/puzzles", function (req, res) {
    var matrix = matrixClass(req.body.lines);
    matrix.initNeighbours();
    var id = uuid.v1();
    puzzles[id] = matrix;
    res.send(id);
});

app.get("/puzzles/:id/words", function (req, res) {
    if (!puzzles.hasOwnProperty(req.params.id)) {
        res.status(404).send("no puzzle for id " + req.params.id);
        return;
    }
    if(!req.query.length) {
        res.status(400).send("query param length required");
        return;
    }
    var result = puzzles[req.params.id].findDictionaryWords(req.query.length, dictionary);
    res.send(result);
});

app.get("/puzzles/:id/tokens", function(req, res) {
    if (!puzzles.hasOwnProperty(req.params.id)) {
        res.status(404).send("no puzzle for id " + req.params.id);
        return;
    }
    if (!req.query.length) {
        res.status(400).send("query param length required");
        return;
    }
    var result = puzzles[req.params.id].findPossibleTokens(req.query.length);
    res.send(result);
});

app.get("/dictionary", function(req, res) {
    res.send({wordCount: dictionary.length});
});
