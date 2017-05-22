'use strict';

var express = require("express");
var app = express();
var twitch = require("./src/server/twitch.js");

app.set("port", (process.env.PORT || 5000));
app.use(express.static(__dirname + "/src/public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/src/views/index.html");
});
app.get("/api/get-channel", function(req, res) {
  var streamName = req.query.channel;
  console.log("In Server.js " + streamName);
  if(streamName !== null) {
  	twitch.getHlsStream(streamName, res);
  } else {
  	res.send({"error": "null_name"});
  }
});
app.get("/api/get-popular-channel", function(req, res) {
	twitch.getPopularChannelList(res);
});
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/src/views/index.html');
});

app.listen(app.get("port"), function() {
	console.log("Server started on port " + app.get("port"));
});
