const timeParser = require("../utilities/timeParser.js");

exports.run = function (message, args) {

	if (client.queues[message.guild.id].queue.length === 0)
		return message.channel.send({ embed: {
			color: client.config.options.embedColour,
			title: "There's no music playing"
		}});

	let guild = client.queues[message.guild.id];
	let track = guild.queue[0];


	i=20,p=(client.bot.voiceConnections.get(message.guild.id).dispatcher.time / 1000)/track.duration,f=i-i*p,x=[''];for(;i--;){x.push(i<f?'▱':'▰');}
	let embed = {
		color       : client.config.options.embedColour,
		title       : track.title,
		url         : track.src !== "soundcloud" ? `https://youtu.be/${track.id}` : undefined,
		description : `${timeParser.formatSeconds(client.bot.voiceConnections.get(message.guild.id).dispatcher.time / 1000)}${track.src === "youtube" ? "/" + timeParser.formatSeconds(track.duration) : ""}\n${x.join('')}`,
		footer: {
			text: `Requested by ${client.bot.users.get(track.req) ? `${client.bot.users.get(guild.queue[0].req).username}#${client.bot.users.get(guild.queue[0].req).discriminator}` : "Unknown"}`
		}
	};

	message.channel.send({ embed: embed });

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Shows info about the currently playing song",
	adminOnly: false,
	DJ: false
};