const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser"); 
// const session = require("express-session");
// const passport = require("passport");
// const FacebookStrategy = require("passport-facebook").Strategy;
// const md5 = require('md5');

const auth = require('./src/auth');
const following = require('./src/following');
const profile = require('./src/profile');
const articles = require('./src/articles');

const app = express();

/*
***********
Database
***********
*/
const models = require('./src/model.js');

/*
***********
Middleware
***********
*/
const whitelist = ['http://localhost:3000', 'http://localhost:80', "https://yo-app-frontend.surge.sh"];
const corsOptions = {
  origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
		  callback(null, true)
		} else {
		  callback(new Error('Not allowed by CORS'))
	    }
  	},
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json())
app.use(cookieParser());

// const upCloud = require('./src/uploadCloudinary.js');

// upCloud.setup(app);

// app.use(session({secret: "secretmsg"}));
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new FacebookStrategy({
// 		clientID: 1218957538291736,
// 		clientSecret: "ce393461685a56ac58075fa4c0158505",
// 		callbackURL: "http://localhost:80/auth/facebook/callback"
// 	},
// 	function (accessToken, refreshToken, profile, done) {
// 		models.User.findOrCreate( {username: profile.displayName, salt: "test", hash: md5("test" + profile.id + md5("Be the Salt and Light of the world."))}, function (err, user) {
// 			if (err) return done(err);

// 			done(null, user);
// 		})
// 	}
// ))


/*
***********
Endpoints
***********
*/

auth(app);
profile(app);
articles(app);
following(app);

// app.get("/auth/facebook", passport.authenticate("facebook"));
// app.get("/auth/facebook/callback", passport.authenticate("facebook", {
// 	successRedirect: "/",
// 	failureRedirect: "/login"
// }));

/*
***********
Server
***********
*/
const port = process.env.PORT || 80
const server = app.listen(port, function () {
	const addr = server.address();
	console.log(`Server listening at http://${addr.address}:${addr.port}`)
})