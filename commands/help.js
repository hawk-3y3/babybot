exports.run = (client, message, args) => {
    const fs = require('fs');
    const prefix = client.config.prefix
    let helpText = "``` ";
    
    if (args[0] == null){
        helpText += ` ---- commands ---- \n\n`
    client.cmdList.forEach(function(element) {
        helpText += ` ${prefix}${element} \n`
    }, this);
    helpText += `\n For more info try ${prefix}help "command" !`
    } else if(true){
        helpText += ` ---- help ---- \n\n`
        args.forEach(function(element) {
            if (!client.cmdList.includes(element)) {
                helpText += `${prefix}${element} is not a valid command \n\n`
            } else {
                let commandFile = require(`./${element}.js`);
            helpText += `command ussage: ${prefix}${element} ${commandFile.help()} \n`
            }
            }, this);
    }

    helpText += (" ```");
    message.channel.send(helpText).catch(console.error);
}

exports.help = () => {
    return "(command) \n    This command, it shows you the available commands for this bot.\n    Adding (command) will return the use of that command.\n"
}

