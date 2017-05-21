var app = angular.module('TwitchApp', ["ngRoute"]);
/*app.config(function($routeProvider) {
	$routeProvider.when("/", {
		templateUrl: "views/index.html",
		controller: ""
	})
})*/
app.controller('StreamEntryController', function($rootScope, $scope, $http, $q){
	$scope.streamer = null;
	$scope.getHlsStream = function() {
		
	}
})