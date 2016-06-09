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

var saltPassword = require('./utils/saltPassword');

app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());
var upload = multer({storage: multer.memoryStorage()});

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

// user
app.get('/user/:id', function (req, res) {
    console.log('get: /user/:id')
    var id = req.params.id;
    var query = User.findOne({_id: id});
    query.select("_id first_name last_name address telephone")
        .exec(function(err, user) {
            console.log('query User.findOne');
            if (err) {
                console.log('error: query User.findOne internal error');
                return res.status(500).json({"error": err});
            }

            if (!user) {
                console.log("error: user not found");
                return res.status(401).json({"error": "user not found"});
            }

            console.log("succeed: find user", user);
            return res.status(200).json(user);
        });
});

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
app.get('/photosOfUser/:id', function(req, res) {
    console.log('post /photosOfUser/:id');

    var id = req.params.id;
    Photo.find({user_id: id}, function(err, photos) {
        if (err) {
            console.log('error: post /photosOfUser/:user_id Photo.find({_id})');
            return res.status(500).json({"error": err});
        }

        console.log('succeed: post /photosOfUser/:user_id Photo.find({_id})');
        return res.status(200).json(photos);
    });
});

// create new photo
app.post('/photos/new', upload.single('uploadphoto'), function(req, res) {
    console.log('post /photos/new');
    var description = req.body.description;
    var price = req.body.price;
    var foodName = req.body.food_name;
    console.log('description: ', description);
    console.log('req.file: ', req.file);

    if (!req.file) {
        console.log("error: file not uploaded");
        return res.status(500).json({"error": "file not uploaded"});
    }
    var timestamp = new Date().valueOf();
    var filename = 'U' +  String(timestamp) + req.file.originalname;
    console.log('filename: ', filename);
    fs.writeFile("./public/images/" + filename, req.file.buffer, function (err) {
        console.log('fs writeFile /photos/new');

        if (err) {
            console.log("error: writeFile /photos/new");
            return res.status(500).json({"error": err});
        }

        Photo.create({
            file_name: filename,
            date_time: timestamp,
            user_id: req.session.user._id,
            description: description || 'no description',
            price: price || '$0',
            food_name: foodName || 'no food name',
        }, function(err, newPhoto) {
            console.log('Photo.create: ', newPhoto);
            if(err) {
                console.log('error: /photos/new Photo.create');
                return res.status(500).json({"error": err});
            }
            console.log('succeed: /photos/new create new photo');
            res.status(200).json(newPhoto);
        });

    });
});

// register
app.post('/user', function(req, res) {
    console.log('post /user');

    User.findOne({login_name: req.body.login_name}, function(err, user){
        console.log('/user User.findOne: ', user);
        if(err) {
            console.log('error: /user User.findOne');
            res.status(500).json({"error": err});
            return;
        }

        if(user) {
            console.log('error: /user user found');
            res.status(400).json({"error": "user already existed"});
            return;
        }

        var saltedPassword = saltPassword.makePasswordEntry(req.body.password);
        delete req.body.password;

        req.body.password_digest = saltedPassword.hash;
        req.body.salt = saltedPassword.salt;

        User.create(req.body, function(err, newUser) {
            console.log('/user User.create');
            if (err) {
                console.log("error: /user User.create");
                return res.status(500).json({"error": err});
            }
            console.log('succeed: /user User.create');
            req.session.user = newUser;
            return res.status(200).json(newUser);
        });
    });
});

// login
app.post('/admin/login', function(req, res){
    console.log('post /admin/login: ', req.body);

    User.findOne({login_name: req.body.login_name}, function(err, user) {
        console.log('/admin/login findOne');

        if (err) {
            console.log('error: User.findOne');
            return res.status(500).json({"error": err});
        }

        if (!user) {
            console.log('user is not exist: ', user);
            return res.status(401).json({"error": "user not found"});
        }

        console.log('succeed: /admin/login');
        if (saltPassword.doesPasswordMatch(user.password_digest, user.salt, req.body.password)) {
            console.log('succeed: /admin/login');
            req.session.user = user;
            return res.status(200).json(user);
        } else {
            console.log('error: /admin/login');
            return res.status(401).json({"error": "password is wrong"});
        }

    });
});

app.listen(port);