/**
 * Created by lei on 5/16/16.
 */

var mongoose = require('mongoose');
var async = require('async');
var fs = require("fs");
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
//var toDoListController = require('./controllers/toDoListController.js');
//var demoCloneController = require('./controllers/demoCloneController.js');

// Load the Mongoose schema for User, Photo
mongoose.connect('mongodb://localhost/hungry');
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');

var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');

app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());
var processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');

app.use(express.static(__dirname));
app.use('/modules', express.static(__dirname + '/node_modules'));
app.use('/client/controllers', express.static(__dirname + '/client/controllers'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/views', express.static(__dirname + '/views'));
app.use('/images', express.static(__dirname + '/public/images'));
app.use('/icons', express.static(__dirname + '/public/icons'));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index');
});

app.use('/hungry', function(req, res, next) {
    console.log(req.url);
    if (req.url === '/login-register') {
        next();
    } else if (!req.session.user){
        res.redirect('/hungry/login-register');
        return;
    }
    next();
});

app.get('/hungry/login-register', function(req, res){
    res.render('login-register/login-register');
});

app.get('/hungry', function(req, res) {
    res.render('hungry');
});

app.get('/sample-simulation', function(req, res) {
    res.render('sample-simulation');
});

//// to-do-list app
//toDoListController(app);
//// demo-clone app
//demoCloneController(app);

// get all photos
app.get('/photos/list', function(req, res) {
    console.log('get /photos/list');
    Photo.find({}, function(err, photos) {
        if (err) {
            console.log('error: get /photos/list photo find{}');
            res.status(500).json({"error": err});
            return;
        }

        console.log('succeed: get /photos/list photo find{}');
        res.status(200).json(photos);
    });
});

// get photo of user
app.post('/photosOfUser/:user_id', function(req, res) {
    console.log('post /photosOfUser/:user_id');

    var id = req.params.user_id;
    Photo.find({_id: id}, function(err, photos) {
        if (err) {
            console.log('error: post /photosOfUser/:user_id Photo.find({_id})');
            res.status(500).json({"error": err});
            return;
        }

        console.log('succeed: post /photosOfUser/:user_id Photo.find({_id})');
        res.status(200).json(photos);
    });
});

// create new photo
// TODO after register
app.post('/photos/new', function(req, res) {
    console.log('post /photos/new');

    //var user_id = req.body.user_id; // TODO: replace with req.session.user._id
    //var description = req.body.description;

    processFormBody(req, res, function (err) {
        if (err || !req.file) {
            console.log("error: /photos/new form body");
            res.status(500).json({"error": err});
            return;
        }
        var timestamp = new Date().valueOf();
        var filename = 'U' +  String(timestamp) + req.file.originalname;
        fs.writeFile("./public/images/" + filename, req.file.buffer, function (err) {
            console.log('fs writeFile /photos/new');

            if (err) {
                console.log("error: writeFile /photos/new");
                res.status(500).json({"error": err});
                return;
            }

            var newPhoto = new Photo({
                file_name: filename,
                date_time: timestamp,
                user_id: req.session.user._id
            });
            newPhoto.save(function(err) {
                if(err) {
                    console.log('error: /photos/new newPhoto save');
                    response.status(500).json({"error": err});
                    return;
                }
            });
            console.log('succeed: /photos/new create new photo');
            response.status(200).json({filename: filename});
        });
    });
});

// register
app.post('/user', function(req, res) {

});

app.listen(port);