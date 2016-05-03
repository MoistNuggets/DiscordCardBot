// Imports
var database = require('./database.js');
var fs = require('fs');

// 'Class' imports
var Discord = require("discord.js");

// Constants
const MESSAGE_REGEX = /{(.*?)}/g

var config = global.config = {};

// Main
fs.readFile("./config.json", "utf8", function(err, data) {
	if (err) {
		console.log(err.message);
		return;
	}
	
	config = global.config = JSON.parse(data);

	var bot = new Discord.Client();

	bot.on("message", function(message) {
		if (config.server_limits && message.channel.server) {
			var serverId = message.channel.server.id;
			var channelId = message.channel.id
			if (serverId in config.server_limits) {
				var channels = config.server_limits[serverId];
				if (channels.indexOf(channelId) == -1) {
					return;
				}
			}
		}
		
		var result = "";
		var results = [];
		
		while ((result = MESSAGE_REGEX.exec(message.content))) {
			results.push(result);
		}
		
		var searches = [];
		
		results.forEach(function(val) {
			var cardName = val[1];
			if (searches.indexOf(cardNames) != -1) {
				return;
			}
			
			searches.push(cardName);
			
			console.log("Processing: " + cardName);
			database.lookup(cardName, function(card) {
				bot.reply(message, card.format());
			});
		});
	});

	if (config.login.token) {
		bot.loginWithToken(config.login.token);
	} else {
		bot.login(config.login.email, config.login.password);
	}
});