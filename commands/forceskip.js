exports.run = function (client, message, args) {

	if (!client.bot.voiceConnections.get(message.guild.id) || !client.queues[message.guild.id].queue[0]) return message.channel.send({ embed: {
		color: config.options.embedColour,
		title: "There's no music playing"
	}});

	if (!(permissions.isDJ(message.member, client) || permissions.isAdmin(message.member)) && client.queues[message.guild.id].queue[0].req !== message.author.id) return message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "Access Denied",
		description: "You need the DJ role to use this command."
	}});

	client.bot.voiceConnections.get(message.guild.id).dispatcher.end();

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Skips the current song by force (no voting)",
	adminOnly: true,
	DJ: true
};