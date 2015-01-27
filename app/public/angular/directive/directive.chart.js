var async = require("async");
var uuid  = require("uuid");


angular.module('AngularApp.directives')
.directive('chart', function($rootScope, $timeout, $compile, chartData) {
    return {
        scope: {
            data:        "=",
            layout:      "=",
            chartLayout: "="
        },
        restrict:    "E",
        replace:     false,

        template: '<div class="chart-wrapper chart-{{chartLayout.type}}"><b>{{chartLayout.name}}</b><div class="chart-inner"></div></div>',
        //templateUrl: "html/widgets/chart.html",
        link: function (scope, element, attrs) {
            scope.uuid = uuid.v4();

            //chartLayout: {
            //    name:    "Histogram of Average Scores",
            //    type:    "histogram",
            //    x:       "avg",
            //    min:     0,
            //    max:     1,
            //    resolution: 0.05,
            //    c3: { bar: { width: { ratio: 0.5 } } }
            //}
            var timeoutId = null;
            ["chartLayout","layout","data"].forEach(function(variable) {
                scope.$watch(variable, function() {
                    $timeout.cancel(timeoutId);
                    timeoutId = $timeout(function() { //
                        console.log("directive.chart.js:32:", "scope.chartLayout", variable, scope.chartLayout);
                        switch( scope.chartLayout && scope.chartLayout.type ) {
                            default: {
                                console.log("directive.chart.js:21:", "scope.chartLayout", scope.chartLayout);
                                break;
                            }
                            case "histogram": {
                                scope.chart = c3.generate($.extend(true, {
                                    bindto: element.find('.chart-inner')[0],
                                    data:   chartData.histogram(scope.data, scope.chartLayout, scope.layout.fields)
                                }, scope.chartLayout.c3));
                                break;
                            }
                        }
                    }, 100);
                })
            })
        }
    }
})
.factory('chartData', function($rootScope) {
    return {
        histogram: function(data, chartLayout, fields) {
            var x_label = fields && fields[chartLayout.x] || chartLayout.x;
            var values  = _.pluck(data, chartLayout.x);

            var buckets = {};
            if( chartLayout.hasOwnProperty("min") ) { buckets[chartLayout.min] = 0; }
            if( chartLayout.hasOwnProperty("max") ) { buckets[chartLayout.max] = 0; }

            for( var i=0, n=values.length; i<n; i++ ) {
                var value = values[i];
                if( chartLayout.precision ) {
                    value = parseFloat(Number(value).toPrecision(chartLayout.precision));
                } else if( chartLayout.resolution ) {
                    value = Math.round( value / chartLayout.resolution ) * chartLayout.resolution;
                    value = parseFloat(Number(value).toPrecision(8)); // avoid floating point errors
                }
                buckets[value] = (buckets[value] || 0) + 1;
            }

            var output = {
                x: 'x',
                columns: [
                    Array.concat("x",     _.map(_.keys(buckets), Number.parseFloat) ),
                    Array.concat(x_label, _.values(buckets))
                ],
                type: 'bar'
            };
            console.log("directive.chart.js:76:histogram", "output", output)
            return output;
        }
    }
})
