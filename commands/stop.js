exports.run = function (message, args) {

	if (!(permissions.isDJ(message.member, client) || permissions.isAdmin(message.member))) return message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "Access Denied",
		description: "You need the DJ role to use this command."
	}});

	if (!client.bot.voiceConnections.get(message.guild.id)) return message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "There's no music playing"
	}});

	client.queues[message.guild.id].repeat = false;
	client.queues[message.guild.id].auto = false
	client.queues[message.guild.id].queue.splice(1, client.queues[message.channel.guild.id].queue.length);
	client.bot.voiceConnections.get(message.guild.id).dispatcher.end();

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Clears the queue and stops playback",
	adminOnly: true,
	DJ: true
};