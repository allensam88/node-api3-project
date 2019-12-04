const express = require('express');

const router = express.Router();

const userDb = require('./userDb.js');
const postDb = require('../posts/postDb.js');

router.post('/', validateUser, (req, res) => {
    const userData = req.body;
    userDb.insert(userData)
        .then(newUser => {
            res.status(201).json(newUser);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "There was an error while saving the new user to the database." });
        });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    const postData = req.body;
    postDb.insert(postData)
        .then(newPost => {
            res.status(201).json(newPost);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "There was an error while saving the new post to the database." });
        });
});

router.get('/', (req, res) => {
    userDb.get(req)
        .then(users => {
            res.status(200).json({ users })
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "The users could not be retrieved." });
        });
});

router.get('/:id', validateUserId, (req, res) => {
    userDb.getById(req.params.id)
        .then(user => {
            res.status(200).json({ user })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ error: "The user could not be retrieved." })
        })
});

router.get('/:id/posts', (req, res) => {
    userDb.getUserPosts(req.params.id)
        .then(userPosts => {
            res.status(200).json({ userPosts })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ error: "The user could not be retrieved." })
        })
});

router.delete('/:id', validateUserId, (req, res) => {
    let deletedUser = {}
    userDb.getById(req.params.id)
        .then(user => {
            deletedUser = user
        })

    userDb.remove(req.params.id)
        .then(count => {
            res.status(200).json({ deletedUser, message: "User has been successfully deleted." })
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "The user could not be removed" });
        });
});

router.put('/:id', validateUserId, (req, res) => {
    const changes = req.body;
    const id = req.params.id;
    userDb.update(id, changes)
        .then(count => {
            userDb.getById(id)
                .then(updatedUser => {
                    res.status(200).json({ updatedUser, message: "The user has been modified." });
                })
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "The user information could not be modified." });
        });
});

//*****CUSTOM MIDDLEWARE*****\\
// 2. validateUserId: validates the user id on every request that expects a user id parameter
// if the id parameter is valid, store that user object as req.user
// if the id parameter does not match any user id in the database, 
// cancel the request and respond with status 400 and { message: "invalid user id" }
function validateUserId(req, res, next) {
    const id = req.params.id;
    userDb.getById(id)
        .then(user => {
            if (!user) {
                res.status(400).json({ message: "invalid user id" })
            } else {
                req.user = user
                next();
            }
        })
}

// 3. validateUser: validates the body on a request to create a new user
// if the request body is missing, cancel the request and respond with status 400 and { message: "missing user data" }
// if the request body is missing the required name field, 
// cancel the request and respond with status 400 and { message: "missing required name field" }
function validateUser(req, res, next) {
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({ message: "missing user data" })
    } else if (!req.body.name) {
        res.status(400).json({ message: "missing required name field" })
    } else {
        next();
    }
}

// 4. validatePost: validates the body on a request to create a new post
// if the request body is missing, cancel the request and respond with status 400 and { message: "missing post data" }
// if the request body is missing the required text field, 
// cancel the request and respond with status 400 and { message: "missing required text field" }
function validatePost(req, res, next) {
    if(Object.keys(req.body).length === 0) {
        res.status(400).json({ message: "missing post data" })
    } else if (!req.body.text) {
        res.status(400).json({ message: "missing required text field" })
    } else {
        next();
    }
}

module.exports = router;
