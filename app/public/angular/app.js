'use strict';

// Declare app level module which depends on filters, and services
angular.module('statisticalLearningApp', [
    'statisticalLearningApp.config',
    'statisticalLearningApp.controllers',
    'statisticalLearningApp.directives',
    'statisticalLearningApp.filters',
    'statisticalLearningApp.resources',
    'statisticalLearningApp.routes',
    'statisticalLearningApp.services'
])
    .config(function( $analyticsProvider ) {
        $analyticsProvider.firstPageview(true); /* Records pages that don't use $state or $route */
        $analyticsProvider.withAutoBase(true);  /* Records full path */
    });


// Declare app level module which depends on filters, and services
angular.module('statisticalLearningApp.config', [])
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


angular.module('statisticalLearningApp.controllers', ['ngStorage','ngPrettyJson']);
angular.module('statisticalLearningApp.directives', []);
angular.module('statisticalLearningApp.validators', []);
angular.module('statisticalLearningApp.services', []);
