exports.run = (client, message, args) => {
        const fs = require('fs');
        const config = require('../config.json');
        // Gets the prefix from the command (eg. "!prefix +" it will take the "+" from it)
        let newPrefix = message.content.split(' ').slice(1, 2)[0];
        // change the configuration in memory
        config.prefix = newPrefix;
        // Now we have to save the file.
        fs.writeFile('../config.json', JSON.stringify(config), (err) => {if (err) console.error(err)});
        // Sending a message to confirm the new prefix
        message.channel.send("The new prefix is " + newPrefix + " !");
}

exports.help = () => {
	return "(new prefix)\n    sets a new prefix for commands\n"
}