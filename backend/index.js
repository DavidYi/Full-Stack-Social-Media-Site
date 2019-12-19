const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser"); 

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

/*
***********
Endpoints
***********
*/

auth(app);
profile(app);
articles(app);
following(app);

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