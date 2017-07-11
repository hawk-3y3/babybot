fsutil = require('../utilities/fsutil.js')

exports.run = async (client, message, args) => {
if(!args[0]){
    message.channel.send({embed:{
        title: `current prefix`,
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