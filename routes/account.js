const express = require('express');
const router = express.Router();
const User = require('../models/user')
const Post = require('../models/post');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');

router.post('/reg', (req, res) => {

    User.findOne({login: req.body.login}, function (err, user){
        if(user) {
            return res.json({success: false, msg: "Истифодабарандаи мазкур бо чунин логин мавҷуд аст!"})
        }
        else {

            let newUser = new User({
                name: req.body.name,
                email: req.body.email,
                login: req.body.login,
                password: req.body.password,
            });

            User.addUser(newUser, (err, user) => {
                if(err) {
                    res.json({ success: false, msg: "Истифодабаранда илова карда нашуд!"})
                }
                else {
                    res.json({ success: true, msg: "Истифодабаранда илова карда шуд."})
                }
            });

        }
    });
});

router.post('/auth', (req, res) => {
    const login = req.body.login;
    const password = req.body.password;

    User.getUserByLogin(login, (err, user) => {
        if(err) throw err;
        if(!user) {
            return res.json({success: false, msg: "Истифодабарандаи мазкур ёфт нашуд."})
        }
        
        User.comparePass(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch) {
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 3600 * 24
                });
                res.json({
                    success: true, msg: "Хуш омадед ба веб-замимаи мо.",
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        login: user.login,
                        email: user.email,
                        role: user.role
                    }
                })
            } else {
                return res.json({success: false, msg: "Парол мутобиқат намекунад!"})
            }
        })
    })
});

router.get('/cabinet', passport.authenticate('jwt', {session : false}), (req, res) => {
    res.send("Cabinet!")
});

router.post('/cabinet', passport.authenticate('jwt', {session : false}),(req, res) => {
    let newPost = new Post({
        category: req.body.category,
        title: req.body.title,
        photoMalumot: req.body.photoMalumot,
        textMalumot: req.body.textMalumot,
        photoTarikh: req.body.photoTarikh,
        textTarikh: req.body.textTarikh,
        photoTajhizot: req.body.photoTajhizot,
        textTajhizot: req.body.textTajhizot,
        photoTamos: req.body.photoTamos,
        textTamos: req.body.textTamos,
        author: req.body.author,
        date: req.body.date,
        photoLocation: req.body.photoLocation,
        textLocation: req.body.textLocation,
        photoFaoliyat: req.body.photoFaoliyat,
        textFaoliyat: req.body.textFaoliyat,
        photoAsarho: req.body.photoAsarho,
        textAsarho: req.body.textAsarho
    });

    Post.addPost(newPost, (err, post) => {
        if(err) {
            res.json({ success: false, msg: "Маълумот нашр нашуд!"})
        }
        else {
            res.json({ success: true, msg: "Маълумот бомуваффақият нашр шуд."})
        }
    });
});


module.exports = router;