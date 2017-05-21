var app = angular.module('TwitchApp', ["ngRoute"]);
/*app.config(function($routeProvider) {
	$routeProvider.when("/", {
		templateUrl: "views/index.html",
		controller: ""
	})
})*/
app.controller('StreamSearchController', function($rootScope, $scope, $http, $q){
	$rootScope.streamer = null;
	$scope.checkField = function() {
		if($rootScope.streamer !== null) {
			console.log("Input not empty");
			$scope.getHlsStream();
		}
	}
	$scope.getHlsStream = function() {
		$http.get("/get-stream", {
			params: {
				"channel": $rootScope.streamer
			}
		}).then(function(res) {
			console.log("Received");
			console.log(res);
			$rootScope.streamArray = res.data;
		});
	}
})
app.controller('StreamQualityListController', function($rootScope, $scope){
	$scope.substringUrl = function(url) {
		return url.length > 100 ? url.substring(0,100) + "...": url;
	}
})