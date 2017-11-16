const ytutil           = require("../utilities/ytutil.js");
const sthandle         = require("../utilities/streamutil.js");
const playCommand      = require("../commands/play.js")

const ytrx = /(?:youtube\.com.*(?:\\?|&)(?:v|list)=|youtube\.com.*embed\/|youtube\.com.*v\/|youtu\.be\/)((?!videoseries)[a-zA-Z0-9_-]*)/i;

exports.run = (message, args, options) => {
    
    if(permissions.isBlocked(message.member)) return message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "Denied",
		description: `Your permissions to use ${client.bot.user.username} on this server are revoked.`
	}});

	if (!args[0]) return message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "You need to specify what to play",
		description: "YouTube: Search Term or URL."
	}});

	if (!client.bot.voiceConnections.get(message.guild.id)) {
		if (!message.member.voiceChannelID)
			return message.channel.send({ embed: {
				color: client.config.options.embedColour,
				title: "Join a voicechannel first.",
            }
        });
    }

    if (message.member.voiceChannelID !== client.bot.voiceConnections.get(message.guild.id).channel.id)
    return message.channel.send({ embed: {
        color: client.config.options.embedColour,
        title: "Join my voicechannel to queue.",
    }});

    let optionlist = []
    optionlist.push('--playnext')
    if (options){
        optionlist.push(options.toString())
    }
    playCommand.run(message, args, optionlist);
}

exports.usage = {
	main: "{prefix}{command}",
	args: "<YouTube URL/Playlist/Search>",
	description: "plays this song next",
	adminOnly: false,
	DJ: false
};