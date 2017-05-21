'use strict';
var http = require("http");
var hls_url =  {
	"base": "https://usher.ttvnw.net/api/channel/hls/",
	"channel": null,
	"params": null
};
var access_token = {
	"base": "https://api.twitch.tv/api/channels/",
	"channel": null,
	"params": "/access_token?adblock=false&need_https=true&platform=web&player_type=site",
	getAccessTokenUrl: function() {
		return access_token.base + access_token.channel + access_token.params;
	}
};
var client_id = "ta24w6i5cmq57c7mszjirohc2ub9ge";

function getHlsStream(channel) {
	console.log("Received - " + channel);
	access_token.channel = channel;
	http.request({
		"host": "api.twitch.tv",
		"path": "/api/channels/" + access_token.channel + access_token.params,
		"method": "GET",
		"headers": {
			"user-agent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
			"client-id": client_id
		}
	}, (res) => {
		console.log(res);
		res.setEncoding('utf8');
		res.on('data', (chunk) => {
			console.log(`BODY: ${chunk}`);
		});
		res.on('end', () => {
			console.log('No more data in response.');
		});
	})
}
module.exports = {
	getHlsStream
}