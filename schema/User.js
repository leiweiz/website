/**
 * Created by lei on 5/21/16.
 */
"use strict";

var mongoose = require('mongoose');

var addressSchema = new mongoose.Schema({
    id: String,
    address: String,     // The text of the comment.
    city: String,
    state: String,
    zip_code: String
});

// create a schema
var userSchema = new mongoose.Schema({
    id: String,     // Unique ID identifying this user
    first_name: String, // First name of the user.
    last_name: String,  // Last name of the user.
    login_name: String,
    password_digest: String,
    salt: String,
    address: addressSchema,
    telephone: String
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
