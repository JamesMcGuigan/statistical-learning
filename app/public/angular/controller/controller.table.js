var async = require('async');
var module = angular.module('AngularApp.controllers');

module.controller('TableController', function($scope, $http) {
    var GraphController = this;
    $scope.config = {};
    $scope.data = {
        filters: {
            currculum_years: [],
            subjects: [],
            topics: [],
            teacher_names: [],
            student_genders: []
        },
        charts: {},
        tables: {
            league_table_teachers: {
                id:     "league_table_teachers",
                name:   "Teacher League Table",
                fields: {
                    // ng-repeate displays in reverse order
                    avg:          "Average Student Score",
                    count:        "Tests Graded",
                    teacher_name: "Teacher Name"
                }
            },
            league_table_students: {
                id:     "league_table_students",
                name:   "Student League Table",
                fields: {
                    avg:          "Average Score",
                    max:          "Maximum Score",
                    min:          "Minimum Score",
                    count:        "Tests Taken",
                    student_name: "Student Name"
                }
            }
        }
    };
    $scope.state = {
        chart_selected: "league_table_teachers"
    };
    $scope.init = function() {
        _($scope.data.filters).keys().forEach(function(key) {
            $http.get("/data/distinct/"+key).success(function(json, status, headers, config) {
                $scope.data.filters[key] = json;
                console.log("controller.graph.js:19:", "$scope.data.filters",key, $scope.data.filters[key])
            });
        });
        $scope.load($scope.state.chart_selected)
    }


    $scope.load = function(chart_name, callback) {
        if( $scope.data.charts[chart_name] ) {
            if( callback instanceof Function ) { callback($scope.data.charts[chart_name]); }

        } else {
            $http.get("/data/queries/"+chart_name).success(function(json, status, headers, config) {
                $scope.data.charts[chart_name] = json;
                if( callback instanceof Function ) { callback($scope.data.charts[chart_name]); }
            });
        }
    };

    $scope.init();
});