var _         = require("lodash");
var assert    = require("assert");
var config    = require('../config/config.js')[process.env.NODE_ENV];
var async     = require("async");
var fs        = require("fs");
var mongojs   = require('mongojs');
var crypto    = require('crypto');
var uuid      = require('node-uuid');
var extend    = require('node.extend');

var db = mongojs(config.db, ['passwd','users']);
var UserAPI = module.exports = {
    /**
     *
     * @param username
     * @param password
     * @param callback function(error, userProfile)
     */
    login: function(request, username, password, callback) {
        db.passwd.findOne({
            username: username,
            password: UserAPI.encodePassword(password)
        }, function(error, userPasswd) {
            if( !error && userPasswd ) {
                request.session.username       = userPasswd.username;
                request.session.loginTimestamp = Date.now();
                UserAPI.getCurrentUser(request, callback);
            } else {
                request.session.username = null;
                callback("Invalid username/password", null);
            }

        });
    },

    logout: function(request, callback) {
        request.session.username = null;
        request.session.loginTimestamp = 0;
        if( callback instanceof Function ) { callback(); }
    },

    /**
     * @param request
     * @param callback function(null||userProfile)
     */
    getCurrentUser: function(request, callback) {
        if( UserAPI.checkLoginTimeout(request) ) {
            db.users.findOne({
                username: request.session.username
            }, function(error, userProfile) {
                callback(null, userProfile);
            });
        } else {
            callback("User logged out", null);
        }
    },

    /**
     *
     * @param user
     * @param callback function(errors, user)
     */
    register: function(user, callback) {
        var errors = [];
        if( !user ) {
            errors.push("No user details");
            callback(errors, null);
        } else {
            UserAPI.usernameExists(user.username, function(userExists) {
                if( userExists ) { errors.push("Username already registered"); }
                else {
                    if( !user.username ) { errors.push("Missing username"); }
                    if( !user.password ) { errors.push("Missing password"); }
                }

                if( errors.length === 0 ) {
                    var userPasswd = {
                        username: user.username,
                        password: UserAPI.encodePassword(user.password)
                    };
                    var userProfile = extend({}, user);
                    delete userProfile.password;
                    delete userProfile.token;

                    db.passwd.insert(userPasswd, function() {
                        db.users.insert(userProfile, function() {
                            callback(null, userProfile)
                        });
                    });
                } else {
                    callback(errors, null);
                }
            });
        }
    },

    checkLoginTimeout: function(request) {
        if( request.session.username ) {
            if (Date.now() - request.session.loginTimestamp > config.loginTimeout) {
                UserAPI.logout(request);
                return false;
            } else {
                request.session.loginTimestamp = Date.now(); // refresh timeout
                return true;
            }
        } else {
            UserAPI.logout(request);
            return false;
        }
    },

    /**
     * @param callback function(<boolean> userExists)
     */
    usernameExists: function(username, callback) {
        db.passwd.find({ username: username }, function(error, userPasswd) {
            var exists = !!userPasswd && !!userPasswd.length;
            callback( exists );
        });
    },

    /**
     * @return encodedPassword
     */
    encodePassword: function(password) {
        var sha256 = crypto.createHash('sha256').update(config.passwordSalt + password).digest("hex");
        return sha256;
    }
}
