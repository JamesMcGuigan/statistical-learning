angular.bootstrap(document, ['AngularApp']);

//FastClick.attach(document.body);
$(window).on("resize", function() {
    //$('[data-equal-height]').make_children_equal_height(); // Removed library as dependency
});
$(window).trigger("resize");

