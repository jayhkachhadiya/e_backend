const session = require('express-session');

const sessionConfig = session({
    secret: process.env.SESSION_SECRATE_KEY,
    resave: false,
    saveUninitialized: true
});

module.exports = sessionConfig;