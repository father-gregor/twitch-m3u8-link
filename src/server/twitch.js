"use strict";
var http = require("http");
var agent = require("superagent");
var hls_url =  {
	"base": "https://usher.ttvnw.net/api/channel/hls/",
	"channel": null,
	"params": null,
	getHlsUrl: function() {
		return this.base + this.channel + this.params;
	}
	setHlsUrl: function(params) {
		var paramsObj = JSON.parse(params);
		this.params = ".m3u8?token=" + paramsObj.token + "&sig=" + paramsObj.sig + "&allow_source=true&allow_spectre=true";
	}
};
var access_token = {
	"base": "https://api.twitch.tv/api/channels/",
	"channel": null,
	"params": "/access_token?adblock=false&need_https=true&platform=web&player_type=site",
	getAccessTokenUrl: function() {
		return this.base + this.channel + this.params;
	}
};
var client_id = "ta24w6i5cmq57c7mszjirohc2ub9ge";

function getHlsStream(channel, resp, returnResponse) {
	console.log("Received - " + channel);
	access_token.channel = channel;
	agent
		.get(access_token.getAccessTokenUrl())
		.set("user-agent", "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36")
		.set("accept", "application/json; charset=utf-8")
		.set("client-id", client_id)
		.end(function(err, res) {
			if (err || !res.ok) {
				console.log(err);
			} else {
				var params = JSON.stringify(res.body);
				console.log(params);
				if(params !== null) {
					getStreamList(params);
					returnResponse(resp);
				}
			}
		});
}
function getStreamList(params) {
	hls_url.setHlsUrl(params);
	agent
		.get(hls_url.getHlsUrl())
		.set("user-agent", "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36")
		.end(function(err, res) {
			if(err || !res.ok) {

			} else {
				console.log(res.body);
			}
		});
}
module.exports = {
	getHlsStream
}