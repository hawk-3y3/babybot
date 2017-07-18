
exports.run = function(message, args) {

	if(permissions.isBlocked(message.member)) return message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "Denied",
		description: `Your permissions to use ${client.bot.user.username} on this server are revoked.`
	}});

	if (client.queues[message.guild.id].queue.length <= 1) return message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "There's nothing queued"
	}});

	if (!parseInt(args[0]) || args[0] <= 0|| args[0] >= client.queues[message.guild.id].queue.length) return message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: `You need to specify a number higher than 0, and less than ${client.queues[message.guild.id].queue.length}`
	}});

	if (client.queues[message.guild.id].queue[Math.round(args[0])].req !== message.author.id && !permissions.isAdmin(message.member))
		return message.channel.send({ embed: {
			color: client.config.options.embedColour,
			title: "You can't unqueue that"
		}});

	message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: `Unqueued`,
		description: `${client.queues[message.guild.id].queue[args[0]].title}`
	}});

	client.queues[message.guild.id].queue.splice(args[0], 1);
};

exports.usage = {
	main: "{prefix}{command}",
	args: "<index>",
	description: "Unqueues the song at the specified position",
	adminOnly: false,
	DJ: false
};