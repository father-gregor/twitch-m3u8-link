"use strict";
var agent = require("superagent");
var check_live_stream =  {
	"base": "https://api.twitch.tv/kraken/streams/",
	"limit": 25
}
var limit_strea
var hls_url =  {
	"base": "https://usher.ttvnw.net/api/channel/hls/",
	"channel": null,
	"params": null,
	getHlsUrl: function() {
		return this.base + this.channel + this.params;
	},
	setHlsUrl: function(params, channel) {
		var paramsObj = JSON.parse(params);
		this.channel = channel;
		this.params = ".m3u8?token=" + encodeURI(paramsObj.token) + "&sig=" + paramsObj.sig + 
			"&allow_source=true&allow_spectre=true&player_backend=html5&expgroup=&baking_bread=false";
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
var stream_list = [];
var response = null;

function getPopularChannelList(resp, limit) {
	agent
		.get(check_live_stream.base + "?limit=" + (check_live_stream.limit + limit))
		.set("user-agent", "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36")
		.set("client-id", client_id)
		.end(function(err, res) {
			if(err || !res.ok) {
				console.log(err);
			} else {
				var arrStreams = res.body.streams;
				if(limit == 0) {
					resp.send(arrStreams);
				} else {
					resp.send(arrStreams.slice(arrStreams.length - 15));
				}
			}
		});
}
function getHlsStream(channel, resp) {
	console.log("Received - " + channel);
	response = resp;
	access_token.channel = channel;
	agent
		.get(check_live_stream.base + channel)
		.set("user-agent", "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36")
		.set("client-id", client_id)
		.end(function(err, res) {
			if(err || !res.ok) {
				console.log(err);
			} else {
				if(res.body.stream != null) {
					getAccessParams(channel);
				} else {
					console.log("Stream is OFFLINE");
					response.send({"error": "offline"});
				}
			}

		});
}
function getAccessParams(channel) {
	agent
		.get(access_token.getAccessTokenUrl())
		.set("user-agent", "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36")
		.set("accept", "application/json; charset=utf-8")
		.set("client-id", client_id)
		.end(function(err, res) {
			if (err || !res.ok) {
				console.log(err);
				response.send({"error": "no_access"});
			} else {
				var params = JSON.stringify(res.body);
				console.log(params);
				getStreamList(params, channel);
				//returnResponse(resp);
			}
		});
}
function getStreamList(params, channel) {
	hls_url.setHlsUrl(params, channel);
	console.log(hls_url.getHlsUrl());
	agent
		.get(hls_url.getHlsUrl())
		.responseType('blob')
		.set("user-agent", "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36")
		.end(function(err, res) {
			if(err || !res.ok) {
				console.log(err);
				response.send({"error": "no_access"});
			} else {
				var hlsFileContent = Buffer.from(res.body);
				console.log(hlsFileContent.toString() + "\n");
				parseHlsFile(hlsFileContent.toString());
				if(stream_list != null) {
					response.send(stream_list);
					stream_list = [];
				}
			}
		});
}
function parseHlsFile(hlsFileStr) {
	var pattern = /#EXT-X-MEDIA.+NAME=\"(.+)\".+\n#EXT-X-STREAM-INF.+\n(.+)/g;
	var resArr = null;
	while((resArr = pattern.exec(hlsFileStr)) != null) {
		var streamObj = {
			quality: resArr[1],
			url: resArr[2]
		};
		stream_list.push(streamObj);
	}
}
module.exports = {
	getHlsStream,
	getPopularChannelList
}