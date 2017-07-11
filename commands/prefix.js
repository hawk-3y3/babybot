fsutil = require('../utilities/fsutil.js')

exports.run = async (client, message, args) => {
client.prefixes[message.guild.id] = args[0];
	await fsutil.fsWriteFile(__dirname + '/../data/prefixes.json', JSON.stringify(client.prefixes, null, 4))

    message.channel.send({embed:{
        title: `Prefix changed`,
        description: `The new prefix for this server will be "${args[0]}" `
        }
    })
}