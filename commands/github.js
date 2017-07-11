'use strict';

// Module to handle the %github command, gives link to the project's github repository
exports.run = (client, message, args) => {
    const pkg = require('../package.json')
        // Respond with github link
        message.channel.send(client.bot.user.username + '\'s code is 100% open-source, github repository: ' + pkg.homepage
            )
            .then(console.log("github link requested by " + message.member.displayName))
            .catch((err) => {
                console.log(`Failed to send the github link message, ${err}`);
            });
    }

exports.help = () => {
    return "\n    Suplies a github link for this bot.\n"
}