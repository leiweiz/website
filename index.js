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
app.use('/avatars', express.static(__dirname + '/public/avatars'));

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
    console.log('get: /user/:id');
    var id = req.params.id;
    var query = User.findOne({_id: id});
    query.select("_id first_name last_name address telephone avatar")
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
        console.log('Photo.find({})');
        if (err) {
            console.log('error: get /photos/list photo find{}');
            return res.status(500).json({"error": err});
        }

        photos = JSON.parse(JSON.stringify(photos));

        async.each(photos, function(photo, callback){
            console.log("async.each(photos)");
            User.findOne({_id: photo.user_id}, function(err, user) {
                console.log("User.findOne");
                if (err) {
                    console.log("error: User.findOne()");
                    return callback(err);
                }

                if (!user) {
                    console.log("error: user not found");
                    return callback({"error": "user not found"});
                }

                photo.user = {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    address: user.address,
                    telephone: user.telephone,
                    avatar: user.avatar
                };
                callback();
            });
        }, function(err){
            console.log("async.each final callback");
            if (err) {
                console.log("error: async.each final callback");
                return res.status(500).json(err);
            }
            console.log('succeed: get /photos/list photo find{}');
            return res.status(200).json(photos);
        });

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

// delete photo
app.delete('/photos/:id', function(req, res) {
    console.log('delete /photo/:id');
    var photoId = req.params.id;
    Photo.findOne({_id: photoId}, function(err, photo) {
        console.log('Photo.findOne /photos/:id');
        if (err) {
            console.log("error: Photo.findOne");
            return res.status(500).json({"error": "internal error"});
        }

        if (!photo) {
            console.log('error: no photo found');
            return res.status(400).json({"error": "no photo found"});
        }

        console.log(photo);
        photo.remove();
        return res.status(200).json({"succeed": "good"});
    });
});

// update photo
app.put('/photos/:id', function(req, res) {
    console.log('put /photos/:id');
    var id = req.params.id;
    var description = req.body.description;
    var price = req.body.price;
    var name = req.body.name;

    Photo.findOne({_id: id}, function(err, photo) {
        console.log('put /photos/:id');
        if (err) {
            console.log("error: put /photos/:id");
            return res.status(500).json({"error": "internal error"});
        }

        if (!photo) {
            console.log("error: photo not found");
            return res.status(400).json({"error": "photo not found"});
        }
        console.log("succeed: ", photo);
        photo.description = description;
        photo.price = price;
        photo.food_name = name;
        photo.save(function(err) {
            console.log('photo.save');
            if (err) {
                console.log("error: photo.save err");
                return res.status(500).json({"error": "internal error"});
            }
            console.log("succeed: photo.save");
            return res.status(200).json({"succeed": "good"});
        });
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
            food_name: foodName || 'no food name'
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

// add comments
app.post('/commentsOfPhoto/:photo_id', function(request, response) {
    console.log("post /commentsOfPhoto/:photo_id");
    var comment = request.body.comment;
    var loginUser = request.session.user;
    var photoId = request.params.photo_id;


    if (!loginUser) {
        return response.status(400).json({"error": "no login user"});
    }

    if (!comment) {
        return response.status(400).json({"error": "comment is empty"});
    }

    Photo.findOneAndUpdate(
        {_id: photoId},
        {$push: {"comments": {"content": comment, "user_id": loginUser._id}}},
        {safe: true, upsert: true},
        function(err, model) {
            console.log('Photo.findOneAndUpdate');
            if (err) {
                console.log('error: Photo.findOneAndUpdate');
                return response.status(500).json({"error": "Internal error"});
            }
            console.log('succeed: saved comment');
            // this model is without new comment
            return response.status(200).json(model);
        }
    );
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
        req.body.avatar = 'default.png';

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

// logout
app.post('/admin/logout', function(req, res) {
    console.log('post /admin/logout');
    if (req.session.user) {
        console.log('exits req.session.user');
        req.session.destroy(function(err) {
            if (err) {
                console.log('error: /admin/logout');
                return res.status(500).json({"error": "internal error"});
            }
            console.log("succeed: /admin/logout");
            return res.status(200).json({"succeed":'logout succeed'});
        })
    } else {
        return res.status(400).json({"error":'no login user'});
    }
});

// change password
app.post('/password/:id', function(req, res) {
    console.log('post /password/:id');
    // TODO: validate new password
    var userId = req.params.id;
    var oldPassword = req.body.old_password;
    var newPassword = req.body.new_password;

    User.findOne({_id: userId}, function(err, user){
        console.log('User.findeOne()');
        if (err) {
            console.log('error: User.findOne()');
            return res.status(500).json({"error": "internal error"});
        }

        if (!user) {
            console.log('error: user not found');
            return res.status(400).json({"error": "user not found"});
        }

        console.log("succeed: user found");
        if (saltPassword.doesPasswordMatch(user.password_digest, user.salt, oldPassword)) {
            console.log('old password is correct');
            var saltedPassword = saltPassword.makePasswordEntry(newPassword);
            user.password_digest = saltedPassword.hash;
            user.salt = saltedPassword.salt;
            user.save(function(err) {
                console.log('user.save new password');
                if (err) {
                    console.log('error: user.save');
                    return res.status(500).json({"error": "internal error"});
                }
                return res.status(200).json({"succeed": "successfully changed"});
            });
        } else {
            console.log('old password is not correct');
            return res.status(400).json({"error": "old password is not correct"})
        }
    });
});

app.listen(port);