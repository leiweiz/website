/**
 * Created by lei on 5/16/16.
 */

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.use('/modules', express.static(__dirname + '/node_modules'));
app.use('/controllers', express.static(__dirname + '/controllers'));
app.use('/public', express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/demo-clone', function(req, res) {
    res.render('demo-clone');
});

app.listen(port);