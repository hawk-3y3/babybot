exports.run = (message, args, options) => {
    if(options? options.includes('--set'): false && args[0]){
        if(client.bot.voiceConnections.get(message.guild.id)){
            if(!permissions.isDJ(message.author, client) || permissions.isAdmin(message.author)){
                return message.channel.send({embed:{
                    color: client.config.options.embedColour,
                    title: "Access Denied",
	                description: "You need the DJ role to use this command."
            }})}
            let djm = args[1].match(/<@(\d+)>/i)
            if (client.bot.voiceConnections.get(message.guild.id).channel.members.includes(djm)){
                client.queues.dj = djm
            }
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