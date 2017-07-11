fsutil = require('../utilities/fsutil.js')

exports.run = async (client, message, args) => {
    if(!args[0]){
        message.channel.send({embed:{
        title: `current volume`,
        description: `the current volume is ${client.volume[message.guild.id]*100}% `
        }})
        return
    
    }

    if(parseInt(args[0])){
        client.volume[message.guild.id] = parseInt(args[0])/100;
	    await fsutil.fsWriteFile(__dirname + '/../data/volume.json', JSON.stringify(client.volume, null, 4))
    }
    message.channel.send({embed:{
        title: `volume changed`,
        description: `The new volume for this server will be ${client.volume[message.guild.id]*100}% `
        }
    })
}