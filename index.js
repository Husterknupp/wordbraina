var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    uuid = require("uuid"),
    readline = require("readline"),
    fs = require("fs"),
    expressWs = require('express-ws')(app), // IntelliJ doesnt know its required
    Puzzle = require("./lib/puzzle").Puzzle;

/*  ===================
    INSTANCE VARIABLES
    ==================
 */
var puzzles = {};
var dictionary = [];
readline.createInterface({
    input: fs.createReadStream("dictionary-de")
}).on("line", (word) => {
    dictionary.push(word.toLowerCase());
});


/*global __dirname:false*/
/*  ====================
    EXPRESS APP SETTINGS
    ====================
 */
app.set("port", (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.listen(app.get("port"), function () { // heroku transparency
    console.log("Node app is running on port", app.get("port"));
});

/*  ========================
    ENDPOINTS AND CONTROLLER
    ========================
 */
app.get("/", function (req, res) {
    res.sendFile('./public/index.html');
});

app.ws("/puzzles-ws", function(ws, req) {
    console.log('new websocket connected');
});

app.get("/puzzles/:id", function (req, res) {
    if (!puzzles.hasOwnProperty(req.params.id)) {
        res.status(404).send("no puzzle for id " + req.params.id);
        return;
    }
    var puzzle = puzzles[req.params.id];
    var puzzleNoNeighbours = puzzle.rows.map(function (row) {
        return row.map(function (field) {
            return {value: field.value, x: field.x, y: field.y};
        });
    });
    res.send(puzzleNoNeighbours);
});

app.post("/puzzles", function(req, res) {
    var puzzle = new Puzzle(req.body.lines, dictionary);
    var id = uuid.v1();
    puzzles[id] = puzzle;
    res.send(id);
});

app.post("/puzzles/:id/findWords", function (req, res) {
    if (!puzzles.hasOwnProperty(req.params.id)) {
        res.status(404).send("no puzzle for id " + req.params.id);
        return;
    }
    if(!req.query.length) {
        res.status(400).send("query param length required");
        return;
    }
    res.send("Starting word finding. Please come back later");
    puzzles[req.params.id].findDictionaryWords(req.query.length, expressWs.getWss('/puzzles-ws').clients, req.params.id);
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
    var result = puzzles[req.params.id].solutions[req.query.length];
    if (!result) {
        res.status(404).send("no solution for this wordLength computed yet.");
        return;
    }
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

app.get("/dictionary/size", function(req, res) {
    res.send({wordCount: dictionary.length});
});
