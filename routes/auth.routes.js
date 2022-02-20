const mongoose = require('mongoose')
const router = require('express').Router();
const User = require('../models/User.model');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');
const bcrypt = require('bcryptjs');

const saltRounds = 10;

router.get('/signup', isLoggedOut, (req,res,next) => {
    res.render('auth/signup')
})

router.post('/signup', (req,res,next) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        res.render('auth/signup', {
          errorMessage: 'All fields are required, please provide your username, email and password',
        });
        return;
    }
    
/*     const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.status(500).render('auth/signup', {
        errorMessage:
          'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.',
      });
      return;
    }
 */
    bcrypt
    .genSalt(saltRounds)                
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      User.create({ username, email, passwordHash: hashedPassword });
      res.redirect('/login')
    })
    .catch((err) => {
        res.redirect('/signup')
        next(err)
    })
})

router.get('/login', (req,res,next) => {
    res.render('auth/login')
})

router.post('/login', (req,res,next) => {
    const {email, password} = req.body

    if (!email || !password) {
        res.render('auth/login', {errorMessage: 'Please provide email and password'});
        return;
    }
    User.findOne({ email })
    .then((user) => {
        if(!user) {
            res.render('auth/login', {errorMessage: 'Email not found'});
            return;
        } else if (bcrypt.compareSync(password, user.passwordHash)) {
            req.session.currentUser = user; //aqui é onde declaro e crio o currentUser
            res.render('profile', {user});
        } else {
            res.render('auth/login', {errorMessage: 'Wrong password'});
        }
    })
})

router.get('/profile', isLoggedIn, (req,res,next) => {
    res.redirect('/profile', req.session.currentUser)
})

router.post('/logout', (req,res,next) => {
    req.session.destroy((err) => {
        if (err) {next(err)}
        res.redirect('/')
    })
})

router.get('/main', isLoggedIn, (req,res,next) => {
    res.render('main', req.session.currentUser)
})

router.get('/private', isLoggedIn, (req,res,next) => {
    res.render('private', req.session.currentUser)
})

module.exports = router;