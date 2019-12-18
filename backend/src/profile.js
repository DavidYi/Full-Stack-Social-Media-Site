// this is profile.js which contains all user profile 
// information except passwords which is in auth.js
const models = require('./model.js');
const cloudinary = require('cloudinary');
const uploadImage = require('./uploadCloudinary');

const profile = {
        username: 'dcy2',
        headline: 'This is my headline!',
        email: 'foo@bar.com',
        zipcode: '12345',
        dob: '128999122000',
        avatar: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/DWLeebron.jpg/220px-DWLeebron.jpg',
    };

function findByUsername(user, filter, callback) {
    if (filter) filter += " -_id";
    else filter = "";

    models.Profile.findOne({ username: user }, filter).exec(function(err, user) {
        callback(err, user);
    });
}

function findAndUpdateByUsername (username, update, callback) {
    models.Profile.findOneAndUpdate({username: username}, update, { new : true })
        .exec( function(err, post) {
            callback(err, post);
        });
}

const getHeadline = (req, res, next) => {
    const callback = (err, user) => {
        if (err) return next(err);

        if (user) res.send( user );
        else Promise.resolve().then(function () {
            res.status(404).send({error: 'No user found with username ' + req.params.user});
            throw new Error('No user found with username ' + req.params.user);
        }).catch(next);
    };
    const username = req.params.user ? req.params.user : req.username;
    findByUsername(username, "username status", callback);
}

const putHeadline = (req, res) => {
    const callback = (err, user) => {
        if (err) return next(err);

        if (user) res.send( { username: user['username'], status: user['status'] } );
        else Promise.resolve().then(function () {
            res.status(404).send({error: 'cannot find loggedin user'});
            throw new Error('cannot find loggedin user');
        }).catch(next);
    };

    let body = req.body;
    let newHeadline = body.headline;
    if (newHeadline !== "" && newHeadline)
        findAndUpdateByUsername(req.username, {status: newHeadline}, callback);
}


const getEmail = (req, res, next) => {
    const callback = (err, user) => {
        if (err) return next(err);

        if (user) res.send( user );
        else Promise.resolve().then(function () {
            res.status(404).send({error: 'No user found with username ' + req.params.user});
            throw new Error('No user found with username ' + req.params.user);
        }).catch(next);
    };

    const username = req.params.user ? req.params.user : req.username;
    findByUsername(username, "username email", callback);
}

const putEmail = (req, res, next) => {
    const callback = (err, user) => {
        if (err) return next(err);

        if (user) res.send( { username: user['username'], email: user['email'] } );
        else Promise.resolve().then(function () {
            res.status(404).send({error: 'cannot find loggedin user'});
            throw new Error('cannot find loggedin user');
        }).catch(next);
    };

    let body = req.body;
    let newEmail = body.email;
    if (newEmail !== "" && newEmail)
        findAndUpdateByUsername(req.username, {email: newEmail}, callback);
}

const getZipCode = (req, res, next) => {
    const callback = (err, user) => {
        if (err) return next(err);

        if (user) res.send( user );
        else Promise.resolve().then(function () {
            res.status(404).send({error: 'No user found with username ' + req.params.user});
            throw new Error('No user found with username ' + req.params.user);
        }).catch(next);
    };

    const username = req.params.user ? req.params.user : req.username;
    findByUsername(username, "username zipcode", callback);
}

const putZipCode = (req, res) => {
    const callback = (err, user) => {
        if (err) return next(err);

        if (user) res.send( { username: user['username'], zipcode: user['zipcode'] } );
        else Promise.resolve().then(function () {
            res.status(404).send({error: 'cannot find loggedin user'});
            throw new Error('cannot find loggedin user');
        }).catch(next);
    };

    let body = req.body;
    let newZip = body.zipcode;
    if (newZip !== "" && newZip)
        findAndUpdateByUsername(req.username, {zipcode: newZip}, callback);
}

const getDOB = (req, res, next) => {
    const callback = (err, user) => {
        if (err) return next(err);

        if (user) res.send( user );
        else Promise.resolve().then(function () {
            res.status(404).send({error: 'No user found with username ' + req.params.user});
            throw new Error('No user found with username ' + req.params.user);
        }).catch(next);
    };

    const username = req.params.user ? req.params.user : req.username;
    findByUsername(username, "username dob", callback);
}


const getAvatar = (req, res, next) => {
    const callback = (err, user) => {
        if (err) return next(err);

        if (user) res.send( user );
        else Promise.resolve().then(function () {
            res.status(404).send({error: 'No user found with username ' + req.params.user});
            throw new Error('No user found with username ' + req.params.user);
        }).catch(next);
    };

    const username = req.params.user ? req.params.user : req.username;

    findByUsername(username, "username avatar", callback);
}

const putAvatar = (req, res) => {

    const callback = (err, user) => {
        if (err) return next(err);

        if (user) res.send( { username: user['username'], avatar: user['avatar'] } );
        else Promise.resolve().then(function () {
            res.status(404).send({error: 'cannot find loggedin user'});
            throw new Error('cannot find loggedin user');
        }).catch(next);
    };
    console.log("url is" + req.fileurl);

    let body = req.body;
    if (req.fileurl)
    findAndUpdateByUsername(req.username, {avatar: req.fileurl}, callback);
}

const getProfile = (req, res, next) => {
    const callback = (err, user) => {
        if (err) return next(err);

        if (user) res.send( user );
        else Promise.resolve().then(function () {
            res.status(404).send({error: 'No user found with username ' + req.params.user});
            throw new Error('No user found with username ' + req.params.user);
        }).catch(next);
    };

    const username = req.params.user ? req.params.user : req.username;

    findByUsername(username, "", callback);
}


module.exports = (app) => {
    app.get('/headline/:user?', getHeadline);
    app.put('/headline', putHeadline);


    app.get('/email/:user?', getEmail);
    app.put('/email', putEmail);

    app.get('/zipcode/:user?', getZipCode);
    app.put('/zipcode', putZipCode);

    app.get('/dob/:user?', getDOB);

    app.get('/avatar/:user?', getAvatar);
    app.put('/avatar', uploadImage('avatar'), putAvatar);

    app.get('/profile/:user?', getProfile);
}