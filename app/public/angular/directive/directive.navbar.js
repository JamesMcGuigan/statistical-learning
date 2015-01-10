var async = require("async");

angular.module('statisticalLearningApp.directives')
    .directive('navbar', function($rootScope, $http, $location, $timeout, UserService) {
        return {
            restrict:    "E",
            replace:     true,
            templateUrl: "html/partial/navbar.html",
            link: function ($rootScope, scope, element, attrs) {
                scope.init = function() {
                    // $rootScope.user;
                    scope.loginForm = {
                        username: "",
                        password: "",
                        error:    ""
                    };
                };

                scope.login = function() {
                    UserService.login(scope.loginForm.username, scope.loginForm.password, function(error, user) {
                        scope.loginForm.error = UserService.loginError || "";
                        $timeout(function() { scope.$apply(); });
                    })
                };

                scope.logout = function() {
                    UserService.logout(function() {
                        scope.loginForm.error = "";
                        $location.path('/');
                        $timeout(function() { scope.$apply(); });
                    });
                };
                scope.init();
            }
        }
    })
