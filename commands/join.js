

exports.run = async (client, message, args) => {
    const channel = message.member.voiceChannel;

    if (channel == null){message.channel.send("you're not in a voicechannel on this server")}
    else {
        if (!channel.joinable) {
            if (channel.full) {
                message.channel.send("your voice channel is full, I can't join")
                return
            } else {
                message.channel.send("i do not have permission to join this voice channel")
                return
            }
        }
        await channel.join()
        .catch(console.error);

        message.channel.send("test :>");
    }
}

exports.help = () => {
    return "(N/A)\n    makes the bot join the voice channel\n"
}