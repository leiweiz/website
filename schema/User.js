/**
 * Created by lei on 5/21/16.
 */
"use strict";

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    avatar: String,
    content: String,
    user_id: mongoose.Schema.Types.ObjectId
});

var User = mongoose.model('User', userSchema);

module.exports = User;
