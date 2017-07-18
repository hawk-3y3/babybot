exports.run = function (message, args) {

	if(permissions.isBlocked(message.member)) return message.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Denied",
		description: `Your permissions to use ${client.bot.user.username} on this server are revoked.`
	}});

	if (!client.voiceConnections.get(message.guild.id) || client.queues[message.guild.id].queue.length === 0) return message.channel.send({ embed: {
		color: config.options.embedColour,
		title: "There's no music playing"
	}});

	client.voiceConnections.get(message.guild.id).dispatcher.resume();

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Resume playback of the current song if it was paused",
	adminOnly: false,
	DJ: false
};