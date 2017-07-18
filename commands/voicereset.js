exports.run = async function (message, args) {

	if (!(permissions.isDJ(message.member, client) || permissions.isAdmin(message.member))) return message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "Access Denied",
		description: "You need the DJ role to use this command."
	}});

	let m = await message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "Resetting voice..."
	}});

	if (client.bot.voiceConnections.get(message.guild.id)){
		client.bot.voiceConnections.get(message.guild.id).on("disconnect", () => {
			client.bot.voiceConnections.forEach(vc => {
				if (vc.dispatcher) {
					if (!vc.dispatcher.paused) {
						setTimeout( function() {
							vc.dispatcher.pause();
							setTimeout( function() {
								vc.dispatcher.resume();
							}, 250);
						}, 100);
					}
				}
			})
		});

		client.bot.voiceConnections.get(message.guild.id).disconnect();
	}

	client.queues[message.guild.id].queue = [];

	m.edit({ embed: {
		color: client.config.options.embedColour,
		title: "Voice Reset"
	}});

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Resets the voiceconnection if the bot is stuck",
	adminOnly: true,
	DJ: true
};