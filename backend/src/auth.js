// this is in auth.js
const models = require('./model.js');
const md5 = require('md5');
const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const cookieKey = 'sessionId';
const pepper = md5("Be the Salt and Light of the world.");


const redis = require('redis').createClient(process.env.REDIS_URL);

//get user with the specified username
async function getUser(username) {
	return await models.User.findOne({username: username});
}

//update user with the username and then execute the callback
function findUserAndUpdateByUsername (username, update, callback) {
    models.User.findOneAndUpdate( {username: username}, update, { new: true })
        .exec( function(err, post) {
            callback(err, post);
        });
}

//hceck if there is a user logged in
function isLoggedIn(req, res, next) {
	//dont check if the user is logged in in these api calls
	if ((req.path == '/' && req.method == "GET") 
		|| (req.path == '/register' && req.method == "POST")
		|| (req.path == '/login' && req.method == "POST")) return next();

	//get the session id from the cookie	
    const id = req.cookies[cookieKey];

    //if id is not found then that means that there is no cookie for session id
    if (!id) {
    	res.status(401).send({error: "cookie for session id was not found"});
    	return;
    }

    //get the user information associated with that session Id
    redis.hget("sessions", id, function (err, user) {
    	if (err) {
    		console.log(err.toString());
    		res.status(401).send({error: "sessionId couldnt be found\n" + err.toString()});
    	}

    	//need to parse because user is stored as a string when it is actually an object
    	const json = JSON.parse(user);

	    const username = json['username'];
	    if (username) {
	    	//have logged in username for use when defining what to do in the end point
	    	req.username = username;
	    	return next();
	    } else {
	        res.status(401).send({error: "user with username " + username + " was not found"});
	    }
    });
}

//register a new user (used for POST /register endpoint)
async function register(req, res, next) {
	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;
	const dob = req.body.dob;
	const zipcode = req.body.zipcode;

	if (!username || !password) {
        res.status(400).send({error: "missing username and/or password"});
		return;
	} else if (await getUser(username)) {
        res.status(400).send({error: "user with username " + username + " already exists"});
		return;
	}

	//generate salt and hash out of the password to create a new user
	bcrypt.genSalt(saltRounds, function(err, salt) {
		const hash = md5(salt + password + pepper);
		const newUser = new models.User({
	        username: username,
	        salt: salt,
	        hash: hash
	    });

		//create a new user with the associated salt, hash, and username
	    newUser.save(function (err) {
	      if (err) return next(err);
	      // saved!
	      console.log("\n\ncreated new user with username " + username + " and password " + password);
	    });

	    //now that there is a user, need to make a profile for the user
	    const newProfile = new models.Profile({
	    	username: username,
	    	email: email,
	    	dob: dob,
	    	zipcode: zipcode,
	    	//default avatar image url
	    	avatar: 'https://uwosh.edu/deanofstudents/wp-content/uploads/sites/156/2019/02/profile-default.jpg'
	    });

	    newProfile.save(function (err) {
	      if (err) return next(err);
	      // saved!
	      console.log("created new profile for user " + username);
	    });

	    const msg = { username: username, result: 'success' };
		res.send(msg);
	});
}

//method to login with the associated username and password (used for POST /login endpoint)
async function login(req, res, next) {
	const id = req.cookies[cookieKey];

	//check if there is a logged in username already, meaning that this should not be happening
	if (id || req.body.isLoggedIn) {
		redis.hget('sessions', id, function (err, user) {
			if (err) {
				console.log("there has been an error help!!!");
			}
			if (user) {
		    	Promise.resolve().then(function () {
		        	res.send({error: "A user is already logged in. Need to log out first!!", redirect: true, username: req.username});
		            if (!req.body.isLoggedIn) throw new Error("need to log out first!!"); //check if we can let them into login page
		        }).catch(next);
			} else if (req.body.isLoggedIn) {
				// tell them not to redirect
				res.send({redirect: false, error: "should not be happening since we pass if its from this endpoint"});
			}
		});
		return;
    }

	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		res.sendStatus(400);
		return;
	}

	const userObj = await getUser(username);
	const hash = md5(userObj.salt + password + pepper);

	//if hash does not map, then password is wrong an if the userObj does not exist, then the username does not exist
	if (!userObj || userObj.hash !== hash) {
    	res.status(401).send({error: "The username/password pair does not match"});
		return;
	}

	// "security by obscurity" we don't want people guessing a sessionkey
    const sessionKey = md5("secret message!" + new Date().getTime() + userObj.username);

    //add the sessionKey/userObj pair into the session store
    redis.hmset('sessions', sessionKey, JSON.stringify(userObj));

    // this sets a cookie
    res.cookie(cookieKey, sessionKey, { maxAge: 3600*1000, httpOnly: true});

	const msg = { username: username, result: 'success', cookieKey: sessionKey};
	res.send(msg);
}

//logout current user (is used in the PUT /logout endpoint)
function logout(req, res) {
	//reset everything that was done to login
	res.clearCookie(cookieKey);

	res.sendStatus(200);
}

//change password for current user (used in PUT /password endpoint)
async function changePassword(req, res) {
	const newPassword = req.body.password;
	if (!newPassword || newPassword === "") {
    	res.status(400).send({error: "Could not find the new Password <-- shouldnt happen"});
    	return;
	}

	const userObj = await getUser(req.username);
	const hash = md5(userObj.salt + newPassword + pepper);

	if (hash === userObj.hash) {
		res.status(400).send("Same Password");
	}
	
	const callback = (err, user) => {
        if (err) return next(err);

        if (user) res.send({ username: req.username, result: 'success' });
        else Promise.resolve().then(function () {
            res.status(404).send({error: "could not get loggedin user  <-- shouldnt happen"});
            throw new Error("could not get loggedin user  <-- shouldnt happen");
        }).catch(next);
    }

	findUserAndUpdateByUsername(req.username, {hash: hash}, callback);
}

module.exports = (app) => {
	app.use(isLoggedIn);
	app.post("/login", login);
	app.post("/register", register);
	app.put("/logout", logout);
	app.put("/password", changePassword);
}