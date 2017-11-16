exports.run = (message, args) => {

    if(permissions.isBlocked(message.member)) return message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "Denied",
		description: `Your permissions to use ${client.bot.user.username} on this server are revoked.`
    }});
    
    if (!(permissions.isDJ(message.member, client) || permissions.isAdmin(message.member)) && client.queues[message.guild.id].queue[0].req !== message.author.id) return message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "Access Denied",
		description: "You need the DJ role to use this command."
    }});
    
    if (!client.bot.voiceConnections.get(message.guild.id)) return message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "There's no music playing"
    }});
    
    if(!client.queues[message.guild.id].queue.length <= 1) return message.channel.send({ embed: {
        color: client.config.options.embedColour,
        title: "there's no music queued"
    }})

    let queue = client.queues[message.guild.id].queue
    let currentSong = queue[0]

    queue.shift()
    shuffleArray(queue)
    queue.unshift(currentSong)

    client.queues[message.guild.id].queue = queue

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}
return message.channel.send({embed:{
    color: client.config.options.embedColour,
    title: "The queue has been shuffled"
    
}})

exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "shuffles the music queue",
	adminOnly: true,
	DJ: true
};