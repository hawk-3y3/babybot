exports.run = (client, message, args) => {
    console.log(message.channel.nsfw)
    
    
    message.channel.send("result");
}