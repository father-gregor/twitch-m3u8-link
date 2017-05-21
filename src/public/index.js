var app = angular.module('TwitchApp', ["ngRoute"]);
/*app.config(function($routeProvider) {
	$routeProvider.when("/", {
		templateUrl: "views/index.html",
		controller: ""
	})
})*/
app.controller('StreamEntryController', function($rootScope, $scope, $http, $q){
	$scope.streamer = null;
	$scope.checkField = function() {
		if($scope.streamer !== null) {
			console.log("Input not empty");
			$scope.getHlsStream();
		}
	}
	$scope.getHlsStream = function() {
		$http.get("/get-stream", {
			params: {
				"channel": $scope.streamer
			}
		}).then(function(res) {
			console.log(res);
		});
	}
})