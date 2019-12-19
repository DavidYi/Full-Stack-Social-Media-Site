// this is profile.js which contains all user profile 
// information except passwords which is in auth.js
const models = require('./model.js');
const uploadImage = require('./uploadCloudinary');

//find the Profile by the username with specified filter and then execute callback 
function findByUsername(user, filter, callback) {
    //if there is a filter, then it means that they are looking for the specified and nothing else
    if (filter) filter += " -_id";
    else filter = "";

    models.Profile.findOne({ username: user }, filter).exec(function(err, user) {
        callback(err, user);
    });
}

//find the Profile by the usernae and update it and then execute the callback 
function findAndUpdateByUsername (username, update, callback) {
    models.Profile.findOneAndUpdate({username: username}, update, { new : true })
        .exec( function(err, post) {
            callback(err, post);
        });
}

//get the Headline (is used in the GET /headline/:user? endpoint)
const getHeadline = (req, res, next) => {
    const callback = (err, user) => {
        if (err) return next(err);

        if (user) res.send( user );
        else Promise.resolve().then(function () {
            res.status(404).send({error: 'No user found with username ' + req.params.user});
            throw new Error('No user found with username ' + req.params.user);
        }).catch(next);
    };

    //check if user was included in the url if not then current username
    const username = req.params.user ? req.params.user : req.username;
    findByUsername(username, "username status", callback);
}

//updates the current user's headline (is used in the PUT /headline endpoint)
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
    //if the newHeadLine is not an empty string and is defined
    if (newHeadline !== "" && newHeadline)
        findAndUpdateByUsername(req.username, {status: newHeadline}, callback);
}

//get the email (is used in the GET /email/:user? endpoint)
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

//update the current user's email (is used in the PUT /email endpoint)
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

//get the zipcode (is used in the GET /zipcode/:user? endpoint)
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

//update the current user's zipcode (is used in the PUT /zipcode endpoint)
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

//get the date of birth (is used in the GET /DOB/:user? endpoint)
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

//get the Avatar image url (is used in the GET /avatar/:user? endpoint)
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

//update the current user's avatar url link (is used in the PUT /avatar endpoint)
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

//get the whole profile info (is used in the GET /profile/:user? endpoint)
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