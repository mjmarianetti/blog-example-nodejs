const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const config = require('../config/app');


module.exports = (db) => {

    const USERNAME_FIELD = 'email',
        PASSWORD_FIELD = 'password',
        JWT_QUERY_FIELD = 'token';

    let auth = {};

    auth.signup = new localStrategy({
        usernameField: USERNAME_FIELD,
        passwordField: PASSWORD_FIELD
    }, async (email, password, done) => {
        try {
            const user = await db.models.User.create({
                email,
                password
            });
            return done(null, user);
        } catch (error) {
            done(error);
        }
    });

    auth.login = new localStrategy({
        usernameField: USERNAME_FIELD,
        passwordField: PASSWORD_FIELD
    }, async (email, password, done) => {
        try {
            const user = await db.models.User.findOne({
                email
            });
            if (!user) {
                return done(null, false, {
                    message: 'Username/Password is incorrect' // user not found
                });
            }
            const validate = await user.isValidPassword(password);
            if (!validate) {
                return done(null, false, {
                    message: 'Username/Password is incorrect' // password incorrect
                });
            }
            return done(null, user, {
                message: 'Logged in Successfully'
            });
        } catch (error) {
            return done(error);
        }
    });

    auth.verify = new JWTstrategy({
        secretOrKey: config.key,
        //we expect the user to send the token as a query parameter with the name 'token'
        jwtFromRequest: ExtractJWT.fromUrlQueryParameter(JWT_QUERY_FIELD)
    }, async (token, done) => {
        try {
            return done(null, token.user);
        } catch (error) {
            done(error);
        }
    });

    return auth;
};