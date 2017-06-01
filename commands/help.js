exports.run = (client, message, args, cmdlist) => {
    const fs = require('fs');
    const config = require('../config.json');
    const prefix = config.prefix
    let helpText = "``` ";
    
    if (args[0] == null){
        helpText += ` ---- commands ---- \n\n`
    cmdlist.forEach(function(element) {
        helpText += ` ${prefix}${element} \n`
    }, this);
    helpText += ` For more info try ${prefix}help command !`
    }

    helpText += (" ```");
    message.channel.send(helpText).catch(console.error);
}