var AppResources = angular.module("AngularApp.resources", ["ngResource"]);

AppResources.factory("MongoAPI", ["$resource", function($resource) {
	return $resource("/api/mongo/:id", {}, {
		get:    {method: "GET",    isArray: false},
		post:   {method: "POST",   isArray: false},
		put:    {method: "PUT",    isArray: false},
		delete: {method: "DELETE", isArray: false}
	});
}]);
