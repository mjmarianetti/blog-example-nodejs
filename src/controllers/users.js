'use strict';
const jwt = require('jsonwebtoken');
const config = require('../config/app');


module.exports = (logger, models, passport) => {

    const BaseController = require('./base')(logger);

    class UsersController extends BaseController {


        async signup(req, res, next) {

            res.json({
                message: 'Signup successful',
                user: req.user
            });
        }

        async login(req, res, next) {

            passport.authenticate('login', async (err, user, info) => {
                try {
                    if (err || !user) {
                        logger.error(err);
                        return this.sendErrorResponse(req, res, {
                            message: 'An Error ocurred'
                        });
                    }
                    req.login(user, {
                        session: false
                    }, async (error) => {
                        if (error) {
                            return this.sendErrorResponse(req, res, error);
                        }

                        const body = {
                            _id: user._id,
                            email: user.email
                        };
                        const token = jwt.sign({
                            user: body
                        }, config.key);

                        return res.json({
                            token
                        });
                    });
                } catch (error) {
                    return this.sendErrorResponse(req, res, error);
                }
            })(req, res, next);
        }

    }

    return UsersController;
};