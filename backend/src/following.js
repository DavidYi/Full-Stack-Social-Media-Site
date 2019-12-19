const models = require('./model.js');

//find the Profile by the username with specified filter and then execute callback 
function findByUsername(user, filter, callback) {
    if (filter && filter !== "") filter += " -_id";
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

//get the followers (is used in the GET /following/:user? endpoint)
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

//add a followers (is used in the PUT /follower endpoint)
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

    //check if the username has a user associated and if it does then add the follower by pushing
    // into the array of followers
	const checkUsername = (err, user) => {
		if (err) return next(err);

        if (user) findAndUpdateByUsername(req.username, {$push: {following: username}}, callback);
        else Promise.resolve().then(function () {
            errormsg = 'No user found with username ' + username;
        	res.status(404).send({error: errormsg});
            throw new Error(errormsg);
        }).catch(next);
	}

    //count the number of profiles with the username, req.username (current user), with a follower, username
    models.Profile.count({username: req.username, following: username}, function (err, count) {
        if (count === 0) {
            //if zero then that means that the current user does not have a follower with the username
            findByUsername(username, "", checkUsername);
        } else {
            res.status(404).send({error: "friend with username " + username + " already exists"});
        }
    });
}

//delete a follower (is used in the DELETE /following/:user endpoint)
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

    //check if there is a profile associated with the username 
    // and if there is then pop it from the array of followers
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