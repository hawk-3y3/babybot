exports.run = function (message, args, options) {

	if (!(permissions.isDJ(message.member, client) || permissions.isAdmin(message.member)))
		return message.channel.send({ embed: {
			color: client.config.options.embedColour,
			title: "Access Denied",
			description: "You need the DJ role to use this command."
		}});

	if (!args)
		return message.channel.send({ embed: {
			color: client.config.options.embedColour,
			title: `Repeat mode: ${client.queues[message.guild.id].repeat == false? "none":client.queues[message.guild.id].repeat}`,
			description: `${client.prefixes[message.guild.id]}repeat < a | c | n >\n\n[All, Current, None]`
		}});

	if (!(args[0] === "a" || args[0] === "c" || args[0] === "n"))
		return message.channel.send({ embed: {
			color: client.config.options.embedColour,
			title: `Repeat mode can only be set to 'a', 'c' or 'n'`,
			description: `[All, Current, None]`
		}});

	if 		(args[0] === "a")  client.queues[message.guild.id].repeat = "All";
	else if (args[0] === "c")  client.queues[message.guild.id].repeat = "Current";
	else if	(args[0] === "n")  client.queues[message.guild.id].repeat = false;

	message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "Repeat Toggled",
		description: `Repeating ${client.queues[message.guild.id].repeat}`
	}});

}

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "Toggles the repeat mode (All -> Current -> None)",
	adminOnly: true,
	DJ: true
};