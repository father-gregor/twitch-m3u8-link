var app = angular.module("TwitchApp", ["ngRoute", "ngAnimate"]);
app.config(function($routeProvider, $locationProvider) {
	$routeProvider.when("/", {
		templateUrl: "partials/main_page.html",
		controller: "MainPageController"
	});
	$routeProvider.when("/search-list", {
		templateUrl: "partials/quality_list.html",
		controller: "StreamQualityListController"
	});
	$routeProvider.when("/not-found", {
		templateUrl: "partials/not_found.html"
	})
	$locationProvider.html5Mode(true);
})
app.controller('StreamSearchController', function($rootScope, $scope, $http, $location){
	$rootScope.streamer = null;
	$scope.checkField = function() {
		var channel = $rootScope.streamer;
		if(channel !== null) {
			channel = $scope.parseChannelName(channel);
			if(channel.length > 0) {
				console.log("Input not empty " + channel);
				$scope.getHlsStream(channel.toLowerCase());
			}
		}
	}
	$rootScope.getHlsStream = function(channel) {
		$http.get("/api/get-channel", {
			params: {
				"channel": channel
			}
		}).then(function(res) {
			console.log("Received");
			console.log(res);
			$rootScope.streamArray = res.data;
			if(!$scope.isError()) {
				$location.path("/search-list");
			} else {
				$location.path("/not-found");
			}
			console.log($rootScope.streamArray);
		}, function(err) {
			console.log(err);
		});
	}
	$scope.parseChannelName = function(name) {
		var n = name.lastIndexOf('/');
		if(n != -1 && n < name.length) {
			return name.substr(n + 1);
		}
		return name;
	}
	$rootScope.showLoadingView = function(show) {
		console.log(show);
		if(show === true) {
			$(".loading").css("display", "block");
			$(".main-view").css("display", "none");
		} else {
			$(".loading").css("display", "none");
			$(".main-view").css("display", "block");
		}
	}
	$scope.isError = function() {
		if(typeof $rootScope.streamArray != "undefined")
			return $rootScope.streamArray.error;
		else
			$location.path("/");
	}
	$(".search-input").keypress(function(e) {
		var key = e.which;
		if(key == 13) {
			$(".search-btn").click();
			return false;
		}
	})
})
app.controller('MainPageController', function($rootScope, $scope, $http){
	$scope.channelLimit = 0;
	$scope.popularChannelArray = [];
	$scope.showLoading = false;
	$scope.streamsLoading = null;
	$scope.loadPopularStream = function() {
		console.log($scope.channelLimit + 25);
		if($scope.channelLimit + 25 <= 100) {
			$scope.streamsLoading = "/partials/streams_loading.html";
			$http.get("/api/get-popular-channel", {
				params: {
					"limit": $scope.channelLimit
				}
			}).then(function(res) {
				$scope.streamsLoading = null;
				$scope.popularChannelArray = $scope.popularChannelArray.concat(res.data);
				$scope.channelLimit = $scope.channelLimit + 15;
				updateGrid = true;
				console.log(res.data);
			});
		}
	}
	$scope.loadPopularStream();
	$scope.checkChannel = function(name) {
		console.log(name);
		if(name !== null && name !== undefined) {
			$scope.showLoading = true;
			$rootScope.streamer = name;
			$rootScope.getHlsStream($rootScope.streamer);
		}
	}
	$scope.substringUrl = function(url) {
		return url.length > 50 ? url.substring(0,50) + "...": url;
	}
	var updateGrid = true;
	$(window).scroll(function() {
		console.log("SCROLL");
	    if(($(window).scrollTop() >= $(document).height() - $(window).height() - 200) && updateGrid) {
	    	console.log("BOTTOM");
	    	updateGrid = false;
	    	$scope.loadPopularStream();
	    }
	});
})
app.controller('StreamQualityListController', function($rootScope, $scope, $location){
	$scope.substringUrl = function(url) {
		return url.length > 100 ? url.substring(0,100) + "...": url;
	}
})