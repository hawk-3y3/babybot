exports.run = (client, message, args) => {
    const fs = require('fs');
    const config = require('../config.json');
    // Gets the prefix from the command (eg. "!prefix +" it will take the "+" from it)
    let input = message.content.split(' ').slice(1, 2)[0];

    if(input === undefined|| input === null){
        message.channel.send(`the current prefix is "${config.prefix}"`)
        return
    }

    // change the configuration in memory
    config.prefix = input;
    // Now we have to save the file.
    fs.writeFile('config.json', JSON.stringify(config, null, 4), (err) => {if (err) console.error('Fail' + err)});
    // Sending a message to confirm the new prefix
    message.channel.send("The new prefix is " + input + " !");
}

exports.help = () => {
	return "(new prefix)\n    sets a new prefix for commands\n"
}

