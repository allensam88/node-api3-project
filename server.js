const express = require('express');
const userRouter = require('./users/userRouter.js');
const server = express();

server.use(express.json());
server.use(logger);

server.get('/', (req, res) => {
    res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use('/api/users', userRouter);

module.exports = server;

//*****CUSTOM MIDDLEWARE*****\\
// 1. logger: logs to the console the following information about each request: request method, request url, and a timestamp
// this middleware runs on every request made to the API
function logger(req, res, next) {
    console.log(`${req.method} to url:${req.originalUrl} at ${Date()}`)
    next();
}
