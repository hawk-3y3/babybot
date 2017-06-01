exports.run = (client, message, args) => {
    let ping = client.ping;
    message.channel.send('pong! ' + ping + " ms").catch(console.error);
}

exports.help = () => {
    return "\n    returns the ping from the bot to the discord server.\n"
}