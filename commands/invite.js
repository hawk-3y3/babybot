'use strict';

// Module to handle the %invite command, gives link that will invite bot to a server
exports.run = (client, message, args) => {
const config = require('../config.json');

    // Respond with invite link
    message.channel.send(`To invite me onto a server use this link ${message.member.displayName}:`)
    message.channel.send(`https://discordapp.com/api/oauth2/authorize?client_id=${config.botuserid}` +'&scope=bot&permissions=8')
}
