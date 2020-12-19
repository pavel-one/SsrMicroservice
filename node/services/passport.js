const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')
const session = require('express-session')

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    });
})

passport.use(
    'local',
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, (email, password, done) => {
        console.log('PASSPORT LOCAL', email, password)
        User.findOne({email: email}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {msg: 'Некорректный email'});
            }
            if (!user.validPassword(password)) {
                return done(null, false, {message: 'Пароли не совпадают'});
            }
            return done(null, user);
        });
    })
)

module.exports = passport;