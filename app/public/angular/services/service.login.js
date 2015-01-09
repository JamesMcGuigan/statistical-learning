angular.module('statisticalLearningApp.services')
    .factory("LoginService", function($rootScope) {
        var LoginService = {
            user: null,
            isLoggedIn: function(callback) {
                callback({ name: "James"});
                //callback(false);
            },
            login: function(username, password, callback) {

            },
            logout: function() {

            },
            register: function(user, callback) {

            }
        }
        return LoginService
    });
