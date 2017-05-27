exports.run = (client, message, args) => {
    let ping = client.ping;
    message.channel.send('pong! ' + ping + " ms").catch(console.error);
}