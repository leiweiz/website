/**
 * Created by lei on 5/16/16.
 */


var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var toDolistController = require('./controllers/toDoListController.js');
var demoCloneController = require('./controllers/demoCloneController.js');

app.use('/modules', express.static(__dirname + '/node_modules'));
app.use('/client/controllers', express.static(__dirname + '/client/controllers'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/views', express.static(__dirname + '/views'));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/hungry', function(req, res) {
    res.render('hungry');
});

// to-do-list app
toDolistController(app);
// demo-clone app
demoCloneController(app);

app.listen(port);