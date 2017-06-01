exports.run = (client, message, args) => {
    console.log(message.channel.nsfw)
    
    
    message.channel.send("test :>");
}

exports.help = () => {
    return "(placeholder arguments)\n    placeholder command discription\n    Adding (placeholder arguments) will do placeholder things.\n"
}