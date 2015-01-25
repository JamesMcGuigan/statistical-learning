'use strict';

// Declare app level module which depends on filters, and services
angular.module('AngularApp', [
    'AngularApp.config',
    'AngularApp.controllers',
    'AngularApp.directives',
    'AngularApp.filters',
    'AngularApp.resources',
    'AngularApp.routes',
    'AngularApp.services',
    "tableSort"
])
    //.config(function( $analyticsProvider ) {
    //    $analyticsProvider.firstPageview(true); /* Records pages that don't use $state or $route */
    //    $analyticsProvider.withAutoBase(true);  /* Records full path */
    //});


// Declare app level module which depends on filters, and services
angular.module('AngularApp.config', [])
    .constant('version', "0.1")
    .constant('keyCodes', {
        enter:    13,
        up:       38,
        down:     40,
        left:     37,
        right:    39,
        escape:   27,
        space:    32
    });


angular.module('AngularApp.controllers', ['ngStorage','ngPrettyJson','AngularApp.services']);
angular.module('AngularApp.directives', []);
angular.module('AngularApp.validators', []);
angular.module('AngularApp.services', []);
