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
        charts: {}
    };
    $scope.layouts = {
        league_table_teachers: {
            id:     "league_table_teachers",
            name:   "Teacher League Table",
            fields: {
                // ng-repeate displays in reverse order
                teacher_name: "Teacher Name",
                count:        "Tests Graded",
                avg:          "Average Student Score"
            },
            charts: {
                histogram_avg: {
                    name:    "Histogram of Average Scores",
                    type:    "histogram",
                    x:       "avg",
                    min:     0,
                    max:     1,
                    resolution: 0.05,
                    c3: { bar: { width: { ratio: 0.35 } } }
                },
                histogram_count: {
                    name: "Histogram of Number of Tests Graded",
                    type: "histogram",
                    x:    "count",
                    resolution: 200,
                    c3: { bar: { width: { ratio: 1 } } }
                }
                //scatter_count_avg: {
                //    name: "Scatter Plot of Tests Graded vs Scores",
                //    type: "scatter",
                //    x:    "avg",
                //    y:    "count"
                //}
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
            },
            charts: {
                histogram_avg: {
                    name: "Histogram of Average Scores",
                    type: "histogram",
                    x: "avg",
                    min: 0,
                    max: 1,
                    resolution: 0.05,
                    c3: {bar: {width: {ratio: 0.85}}}
                },
                histogram_count: {
                    name: "Histogram of Number of Tests Taken",
                    type: "histogram",
                    x: "count",
                    resolution: 5,
                    c3: {bar: {width: {ratio: 0.55}}}
                }
            }
        }
    };
    $scope.state = {
        query_id:   "league_table_teachers",
        chart_type: null
    };
    $scope.init = function() {
        _($scope.data.filters).keys().forEach(function(key) {
            $http.get("/data/distinct/"+key).success(function(json, status, headers, config) {
                $scope.data.filters[key] = json;
            });
        });
        $scope.load($scope.state.query_id)
    }


    $scope.load = function(chart_name, callback) {
        if( $scope.data.charts[chart_name] ) {
            try {
                if (!$scope.layouts[$scope.state.query_id].charts[$scope.state.chart_type]) {
                    $scope.state.chart_type = _.first(_.keys($scope.layouts[$scope.state.query_id].charts));
                }
            } catch(e) {
                $scope.state.chart_type = null;
            }

            if( callback instanceof Function ) { callback($scope.data.charts[chart_name]); }
        } else {
            $http.get("/data/queries/"+chart_name).success(function(json, status, headers, config) {
                $scope.data.charts[chart_name] = json;
                $scope.load(chart_name, callback);
            });
        }
    };

    $scope.init();
});