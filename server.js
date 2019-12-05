const express = require('express');  // <<<<< 1.
const userRouter = require('./users/userRouter.js');  // <<<<< 2.
const postRouter = require('./posts/postRouter.js');  

const server = express(); // <<<<< 3.

server.use(express.json());  // <<<<< 4.
server.use('/api/users', userRouter);  // <<<<< 5.
server.use('/api/posts', postRouter);

server.use(logger);  // <<<<< 9. (skip if you don't have any global middleware)

server.get('/', (req, res) => {
    res.send(`<h2>Let's write some middleware!</h2>`);  // <<<<< 6.
});


module.exports = server;  // <<<<< 7.

//*****CUSTOM MIDDLEWARE*****\\
// 1. logger: logs to the console the following information about each request: request method, request url, and a timestamp
// this middleware runs on every request made to the API
function logger(req, res, next) {
    console.log(`${req.method} to url:${req.originalUrl} at ${Date()}`)  // <<<<< 8.
    next();
}
