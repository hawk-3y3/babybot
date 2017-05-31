exports.run = (client, message, args, cmdlist) => {
    const fs = require('fs');
    const config = require('../config.json');
    let helpText = "``` ";
    
    helpText += (" ```");
    message.channel.send(helpText).catch(console.error);
}