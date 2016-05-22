/**
 * Created by lei on 5/22/16.
 */

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('../schema/User.js');
mongoose.connect('mongodb://localhost/todolist');
//var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jasonParser = bodyParser.json();

module.exports = function(app) {
    app.get('/to-do-list', function(req, res) {
        res.render('to-do-list')
    });

    app.get('/to-do-list/:userid', function(req, res) {
        var id = req.params.userid;
        User.findOne({_id: id}, function(err, usr) {
            if (err) {
                console.log(err);
                res.status(400).end('Not found');
                return;
            }
            console.log(usr);
            res.status(200).send(usr);
        });
    });

    app.post('/to-do-list', jasonParser, function(req, res) {
        if (!req.body) {
            res.status(400).end('No data');
            return;
        }
        var newUser = User(req.body);
        newUser.save();
        User.find({}, function(err, users) {
            if(err) {
                res.status(500).send(JSON.stringify(err));
            }
            res.json(users);
        });
    });
};