const models = require('./model.js');

function findByUsername(user, filter, callback) {
    if (filter && filter !== "") filter += " -_id";
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

const getFollowings = (req, res, next) => {
	const username = req.params.user ? req.params.user : req.username;

    const callback = (err, user) => {
        if (err) return next(err);

        if (user) res.send( {username: user["username"], following: user["following"]} );
        else Promise.resolve().then(function () {
        	res.status(404).send({error: 'No user found with username ' + username});
            throw new Error('No user found with username ' + username);
        }).catch(next);
    };

    findByUsername(username, "username following", callback);
}

const putFollowings = (req, res, next) => {
	const username = req.params.user;

	const callback = (err, user) => {
        if (err) return next(err);

        if (user) 
            res.send( {username: user["username"], following: user["following"]} );
        else Promise.resolve().then(function () {
        	res.status(404).send({error: "loggedIn user cannot be found?"});
            throw new Error('loggedIn user cannot be found?');
        }).catch(next);
    };

	const checkUsername = (err, user) => {
		if (err) return next(err);

        if (user) findAndUpdateByUsername(req.username, {$push: {following: username}}, callback);
        else Promise.resolve().then(function () {
            errormsg = 'No user found with username ' + username;
        	res.status(404).send({error: errormsg});
            throw new Error(errormsg);
        }).catch(next);
	}

    models.Profile.count({username: req.username, following: username}, function (err, count) {
        if (count === 0) {
            findByUsername(username, "", checkUsername);
        } else {
            res.status(404).send({error: "friend with username " + username + " already exists"});
        }
    });
}

const deleteFollowings = (req, res, next) => {
	const username = req.params.user;

	const callback = (err, user) => {
        if (err) return next(err);

        if (user) res.send( {username: user["username"], following: user["following"]} );
        else Promise.resolve().then(function () {
        	res.status(404).send({error: 'loggedIn user cannot be found?'});
            throw new Error('loggedIn user cannot be found?');
        }).catch(next);
    };

	const checkUsername = (err, user) => {
		if (err) return next(err);

        if (user) findAndUpdateByUsername(req.username, {$pull: {following: username}}, callback);
        else Promise.resolve().then(function () {
        	res.status(404).send({error: 'No user found with username ' + username});
            throw new Error('No user found with username ' + username);
        }).catch(next);
	}

	findByUsername(username, "", checkUsername);
}

module.exports = (app) => {
    app.get('/following/:user?', getFollowings);
    app.put('/following/:user', putFollowings);
    app.delete('/following/:user', deleteFollowings);
}