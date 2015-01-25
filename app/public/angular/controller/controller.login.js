var async = require('async');
var module = angular.module('AngularApp.controllers');

module.controller('LoginController',
    function($rootScope, $scope, $routeParams, $http, $timeout, UserService, MongoAPI) {
        $scope.init = function() {
            // $rootScope.user

            $scope.loginForm = {
                username: "",
                password: "",
                error:    ""
            };

            $scope.registrationForm = {
                username: "",
                password: "",
                success:  false,
                error:    ""
            };
        };

        $scope.login = function() {
            UserService.login($scope.loginForm.username, $scope.loginForm.password, function(error, user) {
                $scope.loginForm.error = UserService.loginError || "";
                $timeout(function() { $rootScope.$apply(); });
            })
        };

        $scope.register = function() {
            delete $scope.registrationForm.error;
            UserService.register($scope.registrationForm, function(error, user) {
                if( error ) {
                    $scope.registrationForm.error   = error;
                    $scope.registrationForm.success = false;
                } else {
                    UserService.login($scope.registrationForm.username, $scope.registrationForm.password, function(error, user) {
                        $scope.registrationForm.success = !!$rootScope.user;
                    });
                }
                $timeout(function() { $rootScope.$apply(); });
            })
        };

        $scope.logout = function() {
            UserService.logout(function() {
                $scope.loginForm.error = "";
                $scope.registrationForm.success = false; // reset flag
                $location.path('/');
            });
        };
        $scope.init();
    }
);
