var app = angular.module('TwitchApp', ["ngRoute"]);
app.config(function($routeProvider, $locationProvider) {
	$routeProvider.when("/", {
		templateUrl: "partials/main.html",
		controller: "MainPageController"
	});
	$routeProvider.when("/search-list", {
		templateUrl: "partials/quality-list.html",
		controller: "StreamQualityListController"
	});
	$locationProvider.html5Mode(true);
})
app.controller('StreamSearchController', function($rootScope, $scope, $http, $location){
	$rootScope.streamer = null;
	$scope.checkField = function() {
		if($rootScope.streamer !== null) {
			console.log("Input not empty");
			$scope.getHlsStream();
		}
	}
	$scope.getHlsStream = function() {
		$http.get("/api/get-channel", {
			params: {
				"channel": $rootScope.streamer
			}
		}).then(function(res) {
			console.log("Received");
			console.log(res);
			$rootScope.streamArray = res.data;
			$location.path("/search-list");
		});
	}
})
app.controller('StreamQualityListController', function($rootScope, $scope){
	$scope.substringUrl = function(url) {
		return url.length > 100 ? url.substring(0,100) + "...": url;
	}
})
app.controller('MainPageController', function($rootScope, $scope, $http){
	$scope.loadPopularStream = function() {
		$http.get("/api/get-popular-channel").then(function(res) {
			$scope.popularChannels = res.data;
			console.log(res.data);
		});
	}
	$scope.loadPopularStream();
})