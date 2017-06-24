exports.run = async (client, message, args) => {
    console.log(` message sent from ${message.member.voiceChannel}`)
    var voiceChannel = message.member.voiceChannel;
    const yt = require('ytdl-core');
    const streamOptions = { seek: 0, volume: client.config.volume };
    let url = 'https://www.youtube.com/watch?v=XAWgeLF9EVQ'






    if (voiceChannel === undefined){message.channel.send("you're not in a voicechannel on this server")}
    else {
        // Play streams using ytdl-core        
        await voiceChannel.join()
        .then(connection => {
            const stream = yt(url, { filter : 'audioonly' });
            const dispatcher = connection.playStream(stream, streamOptions);
            dispatcher.on("end", end => {
                voiceChannel.leave();
            });
        })
        .catch(console.error);
    }
}
exports.help = () => {
        return "(N/A)\n    join voicechannel and play a sound\n"
    }



