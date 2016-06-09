/**
 * Created by lei on 6/4/16.
 */

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/hungry');

var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');

var removePromises = [User.remove({}), Photo.remove({})];

Promise.all(removePromises).then(function() {

    User.create({
        first_name: "leiwei",
        last_name: "zheng",
        login_name: "leiweiz",
        password_digest: "c6bd0bf2337601f54464b67ae774a0cde85f7bfa",
        "salt": "16fd68f11d42cfe5",
        address: {
            address: "55 dinsmore ave apt 503",
            city: "Framingham",
            state: "MA",
            zip_code: "01702"
        },
        telephone: "412-339-4152"
    }, function (err, newUser) {
        if (err) {
            console.log("error: user save");
            return handleError(err);
        }
        console.log("succeed: user saved");

        Photo.create({
            file_name: "pofu.jpg",
            user_id: newUser._id,
            description: "This is my dish",
            price: '$10',
            food_name: 'myfood name',
            avatar: 'default.png',
            comments: [
                {
                    content: "good review",
                    user_id: newUser._id
                },
                {
                    content: "bad review",
                    user_id: newUser._id
                }
            ]
        }, function(err, newPhoto) {
            if (err) {
                console.log("error: photo save");
                return handleError(err);
            }
            console.log("succeed: photo saved");
            mongoose.disconnect();
        });
    });

});