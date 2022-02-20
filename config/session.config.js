const mongoose = require('mongoose')
const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = (app) => {
    //for deploying to heroku
    app.set('trust proxy', 1)

    app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: {
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            //if it's true sameSite = none, if false apply lax.
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 60000 //this is what matters - how long it lives in the browser.
            },
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/lab-express-basic-auth",
            //time to live (seconds)
            ttl: 60*60*24*7
            })
    })
)}