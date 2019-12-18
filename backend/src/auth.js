// this is in auth.js
const models = require('./model.js');
const md5 = require('md5');
const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//let sessionUser = {};
const cookieKey = 'sessionId';
const pepper = md5("Be the Salt and Light of the world.");

const redis = require('redis').createClient(process.env.REDIS_URL);

async function getUser(username) {
	return await models.User.findOne({username: username});
}

function findUserAndUpdateByUsername (username, update, callback) {
    models.User.findOneAndUpdate( {username: username}, update, { new: true })
        .exec( function(err, post) {
            callback(err, post);
        });
}

function isLoggedIn(req, res, next) {
	if ((req.path == '/' && req.method == "GET") 
		|| (req.path == '/register' && req.method == "POST")
		|| (req.path == '/login' && req.method == "POST")) return next();
	
    const id = req.cookies[cookieKey];
	console.log("session key is found to be " + id);

    if (!id) {
    	console.log ("cookie id was not found")
        res.status(401).send({error: "cookie for session id was not found"});
    	return;
    }

    //const user = sessionUser[id];
    redis.hget("sessions", id, function (err, user) {
    	if (err) {
    		console.log(err.toString());
    		res.status(401).send({error: "sessionId couldnt be found\n" + err.toString()});
    	}

    	console.log(user);

    	const json = JSON.parse(user);

	    const username = json['username'];
	    console.log("username is " + username);
	    if (username) {
	    	console.log("what")
	    	req.username = username;
	    	return next();
	    } else {
	        res.status(401).send({error: "user with username " + username + " was not found"});
	    }
    });
}

async function register(req, res, next) {
	//const credentials = auth(req);
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

	bcrypt.genSalt(saltRounds, function(err, salt) {
		const hash = md5(salt + password + pepper);
		const newUser = new models.User({
	        username: username,
	        salt: salt,
	        hash: hash
	    });

	    newUser.save(function (err) {
	      if (err) return next(err);
	      // saved!
	      console.log("\n\ncreated new user with username " + username + " and password " + password);
	    });

	    const newProfile = new models.Profile({
	    	username: username,
	    	email: email,
	    	dob: dob,
	    	zipcode: zipcode,
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

async function login(req, res, next) {
	//const credentials = auth(req);

	const id = req.cookies[cookieKey];

	if (id || req.body.isLoggedIn) {
		redis.hget('sessions', id, function (err, user) {
			if (err) {
				console.log("there has been an error help!!!");
			}
			if (user) {
				console.log (user.username + ", log out first")
		    	Promise.resolve().then(function () {
		        	res.send({error: "A user is already logged in. Need to log out first!!", redirect: true, username: req.username});
		            if (!req.body.isLoggedIn) throw new Error("need to log out first!!"); //check if we can let them into login page
		        }).catch(next);
			} else if (req.body.isLoggedIn) {
				res.send({redirect: false, error: "is not logged in so need to log in now!"});
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
	// console.log(userObj);
	// console.log(userObj.username);
	const hash = md5(userObj.salt + password + pepper);
	if (!userObj || userObj.hash !== hash) {
    	res.status(401).send({error: "The username/password pair does not match"});
		return;
	}

	// "security by obscurity" we don't want people guessing a sessionkey
    const sessionKey = md5("secret message!" + new Date().getTime() + userObj.username);

    redis.hmset('sessions', sessionKey, JSON.stringify(userObj));
    // sessionUser[sessionKey] = userObj;

    // this sets a cookie
    res.cookie(cookieKey, sessionKey, { maxAge: 3600*1000, httpOnly: false});
    //******* MAKE SURE TO CHANGE TO TRUE

	const msg = { username: username, result: 'success', cookieKey: sessionKey};
	res.send(msg);
}

function logout(req, res) {
	console.log("logging out");

//	sessionUser = {};
	req.username = undefined;
	const cookie = req.cookies;
	console.log(cookie);
	res.clearCookie(cookieKey);
	// for (prop in cookie) {
 //        if (!cookie.hasOwnProperty(prop)) {
 //            continue;
 //        }
 //        res.cookie(prop, "", {expires: new Date(0)});
 //    }
	res.sendStatus(200);
}

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