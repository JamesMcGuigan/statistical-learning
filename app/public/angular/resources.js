var AppResources = angular.module("statisticalLearningApp.resources", ["ngResource"]);

//AppResources.factory("UserAPI", function($resource) {
//	return {
//		login:      $resource("/user/login").post,
//		logout:     $resource("/user/logout").get,
//		getCurrent: $resource("/user/current").get,
//		register:   $resource("/user/register").post
//	}
//});


AppResources.factory("MongoAPI", ["$resource", function($resource) {
	return $resource("/api/mongo/:id", {}, {
		get:    {method: "GET",    isArray: false},
		post:   {method: "POST",   isArray: false},
		put:    {method: "PUT",    isArray: false},
		delete: {method: "DELETE", isArray: false}
	});
}]);
AppResources.factory("InfographicFile", ["$resource", function($resource) {
    return $resource("/api/filesystem/:id", {}, {
        get:    {method: "GET",    isArray: false},
        post:   {method: "POST",   isArray: false}
//        put:    {method: "PUT",    isArray: false},
//        delete: {method: "DELETE", isArray: false}
    });
}]);