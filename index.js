const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const config = require('./config/db');
const account = require('./routes/account');
const session = require('express-session');
const Post = require('./models/post');
const jwt = require('jsonwebtoken');
const app = express();

const port = 3000;

app.use(session({
    secret: 'some_secret_key',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use(cors());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));

//app.use(express.static(path.join(__dirname, 'public')));

mongoose.set('strictQuery', true);


mongoose.connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true });


mongoose.connection.on('connected', () => {
    console.log("Пайвасти бомуваффақият бо базаи маълумот.")
});


mongoose.connection.on('error', (err) => {
    console.log("Пайвасти номуваффақ бо базаи маълумот!" + err)
});


app.listen(port, () => {
    console.log("Сервер дар порти " + port + " ба кор шурӯъ кард.")
});


app.get('/',  (req, res) => {
    Post.find().sort({date: "desc"}).then(posts => res.json(posts))
});


app.get('/post/:id', (req, res) => {
    let url = req.url.split('/')
    id = url[2]
    Post.findById(id).then(posts => res.json(posts))
});


app.get('/user-posts', passport.authenticate('jwt', {session: false}), (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'some_secret_key');
    Post.find({author: decodedToken.login}).sort({date: "desc"}).then(posts => res.json(posts))
});


app.delete('/post/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    let url = req.url.split('/')
    id = url[2]
    Post.deleteOne({_id: id}).then(posts => res.json({success: true}))
});


app.put('/post/:id/edit', passport.authenticate('jwt', {session: false}), (req, res) => {
    let url = req.url.split('/')
    id = url[2]

    Post.findByIdAndUpdate({_id: id}, {
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
    }, {new: true})
        .then(posts => res.json({success: true}))
})
app.use('/account', account);