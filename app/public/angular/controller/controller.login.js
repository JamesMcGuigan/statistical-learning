var async = require('async');
var module = angular.module('statisticalLearningApp.controllers');

module.controller('LoginController', ['$scope', '$routeParams', '$http',
    function($scope, $routeParams, $http, MongoAPI) {
        var EditController = this;
        $scope.config = {};

//        $scope.load = function() {
//            if( $routeParams.id.match(/^file:/) ) {
//                var filename = $routeParams.id.replace(/^file:/,'');
//                InfographicFile.get({ id: filename }, function(response) {
//                    $scope.config      = response.data;
//                    $scope.config.uuid = "file:"+filename;
//                });
//            } else {
//                MongoAPI.get({ id: $routeParams.id }, function(response) {
//                    $scope.config = response.data;
//                });
//            }
//        };
//
//        $scope.save = function() {
//            if( $routeParams.id.match(/^file:/) ) {
//                var filename = $routeParams.id.replace(/^file:/,'');
//                InfographicFile.post({ id: filename }, $scope.config, function(response) {
//                    if( response.success ) {
//                        alert(filename + " saved");
//                    } else {
//                        alert("Error: " + response.error);
//                    }
//                }, function(response) {
//                    alert("Error: " + response.error);
//                });
//            } else {
////                MongoAPI.get({ id: $routeParams.id }, function(response) {
////                    $scope.config = response.data;
////                });
//            }
//        };
//
//        $scope.load();
    }
]);
