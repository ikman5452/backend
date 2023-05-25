const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config/db');
const {hash} = require("bcrypt");

const PostSchema = mongoose.Schema({
    category: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    photoMalumot: {
        type: String,
    },

    textMalumot: {
        type: String,
    },

    photoTarikh: {
        type: String,
    },

    textTarikh: {
        type: String,
    },

    photoTajhizot: {
        type: String,
    },

    textTajhizot: {
        type: String,
    },

    photoTamos: {
        type: String,
    },

    textTamos: {
        type: String,
    },

    photoLocation: {
        type: String,
    },

    textLocation: {
        type: String,
    },

    photoFaoliyat: {
        type: String,
    },

    textFaoliyat: {
        type: String,
    },

    photoAsarho: {
        type: String,
    },

    textAsarho: {
        type: String,
    },

    author: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },
});

const Post = module.exports = mongoose.model('Post', PostSchema);

module.exports.addPost = function (newPost, callback) {
    newPost.save(callback);
};




