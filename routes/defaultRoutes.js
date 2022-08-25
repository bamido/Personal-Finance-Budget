const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/defaultController');
const User = require("../models/userModel.js");
const brcypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash/lib/flash');

router.all('/*', function (req, res, next) {
req.app.locals.layout = 'default'; // set layout
next(); // pass control to the next handler
});

// define local strategy
passport.use(new LocalStrategy({
    usernameField: 'emailaddress',
    passReqToCallback: true
    
}, (req, email, password, done)=>{
    // check if user exist by email
    User.findByEmail(email, (err, user) => {
        if(!user){
            return done(null, false, req.flash('error-message', 'Account does not exist!'));
        }

        brcypt.compare(password, user.password, (err, passwordMatched)=>{
            if(err){
                return err;
            }

            if(!passwordMatched){
                return done(null, false, req.flash('error-message', 'Invalid email address or password!'));
            }

            return done(null, user, req.flash('success-message', 'Login successful!'));
        });
    });

}));


passport.serializeUser(function(user, done){
    done(null,user.user_id);
});

passport.deserializeUser(function(userid, done){
    User.findById(userid, (err,user)=>{
        done(err,user);
    });
});

router.get('/', defaultController.index);


router.get('/login', defaultController.loginGet);
router.post('/login', passport.authenticate('local', {
        successRedirect: '/portal/home',
        failureRedirect: '/login',
        failureFlash: true,
        successMessage: true,
        session: true
    }), defaultController.loginPost);


router.get('/register', defaultController.registerGet);
router.post('/register', defaultController.registerPost);

router.post('/logout', defaultController.logout);


module.exports = router;