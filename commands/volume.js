const fsutil = require('../utilities/fsutil.js')


exports.run = async (message, args, options) => {
    
    if ( !(permissions.isDJ(message.member) || permissions.isAdmin(message.member)) ) return message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "Access Denied",
		description: "You need the DJ role to use this command."
    }});
    
    if(!args[0]){
        message.channel.send({embed:{
        title: `current volume`,
        color: client.config.options.embedColour,
        description: `the current volume is ${client.volume[message.guild.id]*100}% `
        }})
        return    
    }
    
    let overload = options ? (options.includes("--overload") && permissions.isAdmin(message.member)) : false

    if(parseInt(args[0])){
        if((parseInt(args[0]) > 100 || parseInt(args[0]) <= 0) && overload === false){
            message.channel.send({embed:{
                title: `out of range`,
                color: client.config.options.embedColour,
                description: `pick a value between 1 and 200% `
            }})
            return
        }        
        client.volume[message.guild.id] = parseInt(args[0])/100;        
        await fsutil.fsWriteFile(__dirname + '/../data/volume.json', JSON.stringify(client.volume, null, 4))
        if (client.bot.voiceConnections.get(message.guild.id) || !client.queues[message.guild.id].queue.length === 0){
            client.bot.voiceConnections.get(message.guild.id).dispatcher.setVolume(args[0]/100);
        }
    }
    message.channel.send({embed:{
        title: `volume changed`,
        color: client.config.options.embedColour,
        description: `The new volume for this server will be ${client.volume[message.guild.id]*100}% `
        }
    })
}

exports.usage = {
	main: "{prefix}{command}",
	args: "<volume 1 - 100>",
	description: "sets the volume of the bot for the server.",
	adminOnly: false,
	DJ: true
};