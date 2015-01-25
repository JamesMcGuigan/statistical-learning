var async = require('async');
var module = angular.module('AngularApp.controllers');

module.controller('GraphController', function($scope, $http) {
    var GraphController = this;
    $scope.config = {};
    $scope.data = {
        filters: {
            currculum_years: [],
            subjects: [],
            topics: [],
            teacher_names: [],
            student_genders: []
        }
    };
    $scope.chart_types = {
        "league_teacher": ""
    }



    _($scope.data.filters).keys().forEach(function(key) {
        $http.get("/data/distinct/"+key).success(function(json, status, headers, config) {
            $scope.data.filters[key] = json;
            console.log("controller.graph.js:19:", "$scope.data.filters",key, $scope.data.filters[key])
        });
    });
});