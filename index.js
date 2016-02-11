var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    _ = require('underscore');

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('<h1>Hello, World!</h1>');
});

app.post('/puzzles', function (req, res) {
    console.log(req.body.lines);
    //var matrix = initMatrix(req.body.lines);
    res.json(req.body);

    //res.setHeader('Content-Type', 'application/json')
    //res.write('you posted:\n');
    //console.log(req.method);
    //res.end(JSON.stringify(req.body, null, 2));
    //res.end('d');
});

// todo can this be removed? Or is it used by heroku?
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

exports.initMatrix = function (lines) {
    var result = [];
    var y = 0;
    _.forEach(lines, function (line) {
        var x = 0;
        var newLine = [];
        _.forEach(line, function (letter) {
            if (letter != '') {
                newLine.push({value: letter, neighbours: [], position: {x: x, y: y}});
            }
            x++;
        });
        result.push(newLine);
        y++;
    });
    return result;
};
