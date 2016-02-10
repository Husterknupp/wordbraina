var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
    res.send('<h1>Hello, World!</h1>');
});

// todo can this be removed? Or is it used by heroku?
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

exports.hello = function() {
    return "world";
};
