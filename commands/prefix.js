fsutil = require('../utilities/fsutil.js')

exports.run = async (client, message, args) => {

if(permissions.isBlocked(message.member)) return message.channel.send({ embed: {
    color: client.config.options.embedColour,
	title: "Denied",
	description: `Your permissions to use ${client.bot.user.username} on this server are revoked.`
}});


if(!args[0]){
    message.channel.send({embed:{
        title: `current prefix`,
        color: client.config.options.embedColour,
        description: `the prefix is currently: "${client.prefixes[message.guild.id]}".`
    }})
    return
}



client.prefixes[message.guild.id] = args[0];
	await fsutil.fsWriteFile(__dirname + '/../data/prefixes.json', JSON.stringify(client.prefixes, null, 4))

    message.channel.send({embed:{
        title: `Prefix changed`,
        description: `The new prefix for this server will be "${args[0]}" `
        }
    })
}

exports.usage = {
    main: "{prefix}{command}",
	args: "<new prefix>",
	description: "sets a new prefix for this server",
	adminOnly: true,
	DJ: false
};