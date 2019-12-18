//Require Mongoose
const mongoose = require('mongoose');
require('./db.js');

//Define a schema
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {type: String, required: true },
	salt: {type: String, required: true },
	hash: {type: String, required: true },
});

const profileSchema = new Schema({
	username: {type: String, required: true },
    status: {type: String, default: "This is my headline!" },
    following: [ {type: String, required: true } ],
    email: {type: String, required: true },
    dob: {type: String, required: true },
    zipcode: {type: String, required: true },
    avatar: {type: String, required: true }
});

const commentSchema = new Schema({
    author: {type: String, required: true },
    body: {type: String, required: true },
    date: {type: Date, default: new Date().getTime() }
});

const postSchema = new Schema({
    author: {type: String, required: true },
    body: {type: String, required: true },
    date: {type: Date, default: new Date().getTime() },
    picture: { type: String }, 
    comments: [ commentSchema ]
});

exports.User = mongoose.model('users', userSchema);
exports.Profile = mongoose.model('profiles', profileSchema);
exports.Post = mongoose.model('posts', postSchema);
exports.Comment = mongoose.model('comments', commentSchema);