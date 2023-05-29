const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/db');
const {hash} = require("bcrypt");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    login: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    createdDate: {
        type: String
    }
});
//
const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByLogin = function (login, callback) {
    const query = {login: login};
    User.findOne(query, callback);
};

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};

module.exports.addUser = function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.comparePass = function (passFromUser, userDbPass , callback) {
    bcrypt.compare(passFromUser, userDbPass, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    })
};