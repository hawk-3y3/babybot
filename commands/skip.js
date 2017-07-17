exports.run = function (client, message, args) {

	if(permissions.isBlocked(message.member)) return message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "Denied",
		description: `Your permissions to use ${client.bot.user.username} on this server are revoked.`
	}});

	if (!client.bot.voiceConnections.get(message.guild.id) || !client.bot.voiceConnections.get(message.guild.id).channel.id) return message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "There's no music playing"
	}});

	if (message.member.voiceChannelID !== client.bot.voiceConnections.get(message.guild.id).channel.id)
		return message.channel.send({ embed: {
			color: client.config.options.embedColour,
			title: "You need to be in my voicechannel to skip"
		}});

	if (client.queues[message.guild.id].svotes.includes(message.author.id))
		return message.channel.send({ embed: {
			color: client.config.options.embedColour,
			title: "You've already voted"
		}});

	client.queues[message.guild.id].svotes.push(message.author.id);

	let voiceMembers = Math.round(message.guild.channels.get(message.member.voiceChannelID).members.filter(m => !m.user.bot).array().length / 2);
	let guild = client.queues[message.guild.id];
	
	if (client.queues[message.guild.id].svotes.length >= voiceMembers || guild.queue[0].req === message.author.id)
		return client.bot.voiceConnections.get(message.guild.id).dispatcher.end();

	message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "Voted to skip",
		description: `${client.queues[message.guild.id].svotes.length}/${voiceMembers} vote(s) needed.`
	}});
}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Vote skip the currently playing song",
	adminOnly: false,
	DJ: false
};