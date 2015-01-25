angular.module('AngularApp.services')
    .factory("UserService", function($rootScope, $http) {
        var UserService = {
            init: function() {
                UserService.getCurrentUser(function() {
                    console.log("UserService.user: ",UserService.user);
                });
            },

            /**
             *  @param username {String}
             *  @param password {String}
             *  @param callback function(error, user)
             */
            login: function(username, password, callback) {
                $http.post('/user/login', {
                    username: username,
                    password: password
                })
                .success(function(json, status, headers, config) {
                    $rootScope.user        = json.user  || null;
                    callback(json.error, $rootScope.user);
                })
                .error(function(json, status, headers, config) {
                    $rootScope.user        = json.user  || null;
                    callback("Server Error", UserService.user);
                })
            },

            /**
             *  @param username {String}
             *  @param password {String}
             *  @param callback function(error, user)
             */
            register: function(user, callback) {
                $http.post('/user/register', { user: user })
                    .success(function(json, status, headers, config) {
                        $rootScope.user        = json.user  || null;
                        callback(json.error, $rootScope.user);
                    })
                    .error(function(json, status, headers, config) {
                        $rootScope.user        = json.user  || null;
                        callback("Server Error", $rootScope.user);
                    })
            },

            /**
             * @param callback function()
             */
            logout: function(callback) {
                $http.get('/user/logout').then(function(response) {
                    $rootScope.user = null;
                    $location.path('/');
                    if( callback instanceof Function ) { callback(); };
                    $timeout(function() { $scope.$apply(); })
                })
            },

            /**
             * @param callback function(error, userProfile)
             */
            getCurrentUser: function(callback) {
                $http.get("/user/current")
                    .success(function(json, status, headers, config) {
                        if( json.error ) {
                            $rootScope.user = null;
                        } else {
                            $rootScope.user = json.user || null;
                        }
                        callback(json.error, json.user);
                    })
                    .error(function(json, status, headers, config) {
                        callback(json.error, null);
                    });
            }
        };
        UserService.init();
        return UserService;
    });