
exports.run = (message, args) => {
	
	if (!(permissions.isDJ(message.member, client) || permissions.isAdmin(message.member))) return message.channel.send({ embed: {
		color: config.options.embedColour,
		title: "Access Denied",
		description: "You need the DJ role to use this command."
	}});    
	
	client.queues[message.guild.id].queue = [client.queues[message.guild.id].queue[0]]

	message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: `Queue purged!`
	}});
}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "emptys the queue",
	adminOnly: true,
	DJ: true
};