var async = require("async");

angular.module('statisticalLearningApp.directives')
    .directive('navbar', function(LoginService) {
        return {
            restrict:    "E",
            replace:     true,
            templateUrl: "html/partial/navbar.html",
            link: function (scope, element, attrs) {
                scope.isLoggedIn = false;
                scope.user       = null;
                LoginService.isLoggedIn(function(user) {
                    scope.isLoggedIn = !!user;
                    scope.user       = user || null;
                })
            }
        }
    })
