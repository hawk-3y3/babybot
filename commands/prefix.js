const fsutil = require('../utilities/fsutil.js')

exports.run = async (message, args) => {
    if (!permissions.isAdmin(message.member)) return message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "Access Denied",
		description: "You need the Admin role to use this command."
    }})

    if(!args[0]) return message.channel.send({embed:{
        title: `current prefix`,
        color: client.config.options.embedColour,
        description: `the prefix is currently: "${client.prefixes[message.guild.id]}".`
    }})

    client.prefixes[message.guild.id] = args[0];
	await fsutil.fsWriteFile(__dirname + '/../data/prefixes.json', JSON.stringify(client.prefixes, null, 4))

    message.channel.send({embed:{
        title: `Prefix changed`,
        color: client.config.options.embedColour,
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