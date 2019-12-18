const models = require('./model.js');

const uploadImage = require('./uploadCloudinary');

var articles = [];

function findPostById (selector, callback) {
    models.Post.find(selector).sort({date: -1}).exec(function(err, posts) {
        callback(err, posts);
    });
}

function findProfileByUsername(user, filter, callback) {
    if (filter && filter !== "") filter += " -_id";
    else filter = "";

    models.Profile.findOne({ username: user }, filter).exec(function(err, user) {
        callback(err, user);
    });
}


function findPostAndUpdateById (selector, update, callback) {
    models.Post.findOneAndUpdate(selector, update, { new: true })
        .exec( function(err, post) {
            callback(err, post);
        });
}

const getArticles = (req, res, next) => {
    let id = req.params.id;

    const callback = (errorMsg) => (err, posts) => {
        if (err) return next(err);

        if (posts) res.send({ articles: posts });
        else Promise.resolve().then(function () {
            res.status(404).send({error: errorMsg});
            throw new Error(errorMsg);
        }).catch(next);
    }

    if (id){
        const selector = require('mongoose').Types.ObjectId.isValid(id) 
            ? { $or: [ { _id: id }, { author: id } ] } 
            : { author: id };
        findPostById( selector, 
            callback('No posts found with id or username ' + req.params.id));
    }
    else{
        const callbackFollowing = (err, user) => {
            if (err) return next(err);

            if (user) {
                findPostById({ 
                        $or: [ {author: user["username"]}, {author: {$in: user["following"]}} ]
                    }, callback("something went wrong with returning all posts"));
            } else Promise.resolve().then(function () {
                const errormsg = 'No user found with username ' + user["username"];
                res.status(404).send({error: errormsg});
                throw new Error(errormsg);
            }).catch(next);
        };

        findProfileByUsername(req.username, "username following", callbackFollowing);
    }
}

const putArticles = (req, res, next) => {
    let id = req.params.id;
    let article = req.body;
    let text = article.text;
    let commentId = article.commentId;

    if (!text){
        Promise.resolve().then(function () {
                res.status(400).send({error: "post body not found"});
                throw new Error("post body not found");
            }).catch(next);
        return;
    }

    const callback = (errorMsg) => (err, post) => {
        if (err) return next(err);

            console.log(post);

            if (post) res.send({ articles: post });
            else Promise.resolve().then(function () {
                res.status(404).send({error: errorMsg});
                throw new Error(errorMsg);
            }).catch(next);
    }

    if (!commentId) {
        findPostAndUpdateById({ _id: id, author: req.username }, { body: text },function(err, post) {
            if (err) return next(err);

            if (post) res.send({ articles: post });
            else Promise.resolve().then(function () {
                const errormsg = "could not find post with id " + id + " with author " + req.username;
                res.status(404).send({error: errormsg});
                throw new Error(errormsg);
            }).catch(next);
        });
    } else if (commentId == -1){ //create new comment
        models.Comment.create({
            author: req.username, //current logged in user
            body: text,
            date: new Date().getTime()
        }, function (err, comment) {
            if (err) return next(err);

            findPostAndUpdateById({ _id: id }, {
            $push: {
                comments: {
                    $each: [comment], 
                    $sort: { date: -1 }
                } 
            }}, callback("could not find post with id " + id + " and create new comment"));
        });
    } else
        findPostAndUpdateById({ _id: id, "comments._id": commentId, "comments.author": req.username }, {$set: {"comments.$.body": text}}, 
            callback("could not find post with id " + id + " and commentId " + commentId  + " with author " + req.username))
}

const postArticle = (req, res, next) => {
    let article = req.body;
    let text = article.text;

    if (!text){
        Promise.resolve().then(function () {
                res.status(400).send({error: "post body not found"});
                throw new Error("post body not found");
            }).catch(next);
        return;
    }

    const newPost = new models.Post({
        author: req.username,
        body: text,
        date: new Date().getTime()
    });

    if (req.fileurl) newPost['picture'] = req.fileurl;

    newPost.save(function (err) {
      if (err) return next(err);
      // saved!
    });
    res.send({ articles: newPost });
}

module.exports = (app) => {
    app.get('/articles/:id?', getArticles);
    app.put('/articles/:id', putArticles);
    app.post('/articleP', uploadImage("picture"), postArticle);
    app.post('/article', postArticle);
}