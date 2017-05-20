'use strict';

var express = require("express");
var app = express();
var twitch = require("./src/server/twitch.js");

app.set("port", (process.env.PORT || 5000));
app.use(express.static(__dirname + "/src/public"));
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/src/views/index.html");
});
app.get("/get-stream", function(req, res) {
  var streamName = "stream";
  console.log("In Server.js");
  twitch.getStream(streamName);	
});

app.listen(app.get("port"), function() {
	console.log("Server started on port " + app.get("port"));
});
