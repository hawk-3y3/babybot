exports.run = (message, args, options) => {

	if(permissions.isBlocked(message.member)) return message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "Denied",
		description: `Your permissions to use ${client.bot.user.username} on this server are revoked.`
	}});
    
    if ((!permissions.isDJ(message.member, client) /*|| permissions.isAdmin(message.member)*/)) {
    if(args[0]){
        let djm = args[0].match(/<@(\d+)>/i)
        client.queues[message.guild.id].dj = djm[1]
        }
    }

    return message.channel.send({embed:{
        color: client.config.options.embedColour,
	    title: "Current DJ",
	    description: client.queues[message.guild.id].dj?`the current dj is <@${client.queues[message.guild.id].dj}>`:`There is currently no DJ on this server`
    }})

}

exports.usage = {
	main: "{prefix}{command}",
	args: "[@mentions]",
	description: "shows current or sellects new dj",
	adminOnly: true,
	DJ: true
};