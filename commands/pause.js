exports.run = function ( message, args) {

	if (!(permissions.isDJ(message.member, client) || permissions.isAdmin(message.member))) return message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "Access Denied",
		description: "You need the DJ role to use this command."
	}});

	if (!client.bot.voiceConnections.get(message.guild.id) || client.queues[message.guild.id].queue.length === 0) return message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "There's no music playing"
	}});

	client.bot.voiceConnections.get(message.guild.id).dispatcher.pause();

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Pause playback",
	adminOnly: true,
	DJ: true
};