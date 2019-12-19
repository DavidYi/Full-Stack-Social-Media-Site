const models = require('./model.js');

const uploadImage = require('./uploadCloudinary');

//find the Articles by the specified selector and then execute callback 
function findPostBySelector (selector, callback) {
    //sort it by the date from latest to earliest
    models.Post.find(selector).sort({date: -1}).exec(function(err, posts) {
        callback(err, posts);
    });
}

//find a profile with the specified username  and then execute callback 
function findProfileByUsername(user, filter, callback) {
    //if filter exists then we dont want the id as well
    if (filter && filter !== "") filter += " -_id";
    else filter = "";

    //find one profile with that username (should be only one anyways)
    models.Profile.findOne({ username: user }, filter).exec(function(err, user) {
        callback(err, user);
    });
}

//update post by a selector and then execute callback
function findPostAndUpdateBySelector (selector, update, callback) {
    models.Post.findOneAndUpdate(selector, update, { new: true })
        .exec( function(err, post) {
            callback(err, post);
        });
}

//find the articles by an id, which could be the author, postId, or nothing (used for GET /articles/id? endpoint)
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

    //check if its the postid or if its looking for posts by the authors
    if (id){
        const selector = require('mongoose').Types.ObjectId.isValid(id) 
            ? { $or: [ { _id: id }, { author: id } ] } 
            : { author: id };
        findPostBySelector( selector, 
            callback('No posts found with id or username ' + req.params.id));
    }
    // otherwise we are getting all posts
    else{
        const callbackFollowing = (err, user) => {
            if (err) return next(err);

            if (user) {
                findPostBySelector({ 
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

//update Article or update/create comment depending on what the id means (used for PUT /articles/:id endpoint)
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

    if (!commentId) {//update post
        findPostAndUpdateBySelector({ _id: id, author: req.username }, { body: text },function(err, post) {
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

            findPostAndUpdateBySelector({ _id: id }, {
            $push: {
                comments: {
                    $each: [comment], 
                    $sort: { date: -1 }
                } 
            }}, callback("could not find post with id " + id + " and create new comment"));
        });
    }//update comment
     else
        findPostAndUpdateBySelector({ _id: id, "comments._id": commentId, "comments.author": req.username }, {$set: {"comments.$.body": text}}, 
            callback("could not find post with id " + id + " and commentId " + commentId  + " with author " + req.username))
}

//create new article (used for POST /article and /articleP (article with image) endpoint)
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

    //if the endpoint was articleP then there should be a req.fileurl through uploadImage middleware
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