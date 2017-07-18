const fs = require("fs");

exports.run = async (message, args) => {
    if (!args[0]) {    
        let commands = await fs.readdirSync(__dirname);
        let prefix = client.prefixes[message.guild.id]
        let cmdList = []
        let adminCmdsList = []
        let djCmdsList = []
        commands.forEach(c => {
			let cmd = require(`./${c}`).usage;
            delete require.cache[require.resolve(`./${c}`)];
            
		    if (permissions.isAdmin(message.member) && cmd.adminOnly && !cmd.DJ){
		    adminCmdsList.push(`**${c.substring(0, c.length - 3)}**: ${cmd.description}`);
		    }
		    if ((permissions.isDJ(message.member, client) || permissions.isAdmin(message.member)) && cmd.DJ){
		    	djCmdsList.push(`**${c.substring(0, c.length - 3)}**: ${cmd.description}`);
		    }
		    if (!cmd.adminOnly && !cmd.DJ && cmd.adminOnly !== undefined){
		    	cmdList.push(`**${c.substring(0, c.length - 3)}**: ${cmd.description}`);
            }
        })
	    let aliases  = require(`../data/aliasses.json`);
	    delete require.cache[require.resolve(`../data/aliasses.json`)];
	    aliases = Object.keys(aliases).map(a => `${a}${pad(10, a)}${aliases[a]}`).join("\n")	
	    let fields = [
	    	{ name: "Aliases", value: `\`\`\`\n${aliases}\n\`\`\``, inline: true },
	    	{ name: "Support", value: `**Getting Started**\n1. Join a voicechannel\n2. ${client.prefixes[message.channel.guild.id]}play <YouTube URL/Query>\n3. If prompted, select a song (1-9)\n\n` },
	    	{ name: "Use/Create the following roles", value: `**NoMusicPerms**: Revokes permission to use this bot.\n**DJ**: Allows the use of some admin commands.` }
	    ]
	    	adminCmdsList.length > 0 && fields.unshift({ name: "Admin Commands", value: `${adminCmdsList.join('\n')}`})
	    	djCmdsList.length > 0 && fields.unshift({ name: "DJ Commands", value: `${djCmdsList.join('\n')}`})

	    	let dmc = await message.author.createDM()
	    	.catch(err => {
	    		return undefined
	    	});
	    	dmc.send({ embed: {
	    		color: client.config.options.embedColour,
	    		title: "Commands",
	    		description: cmdList.join('\n'), 
	    		fields: fields,
	    		footer: {
	    			text: `View command info with ${client.prefixes[message.channel.guild.id]}help <command>`
	    		}
	    	}});

	} else {

		try {
			let cmd = require(`./${args[0]}.js`).usage;
			delete require.cache[require.resolve(`./${args[0]}.js`)];
			message.channel.createMessage({ embed: {
				color: config.options.embedColour,
				title: `${cmd.main.replace("{command}", args[0].toLowerCase()).replace("{prefix}", prefixes[message.channel.guild.id])} ${cmd.args}`,
				description: cmd.description
			}});
		} catch (err) {
			message.channel.createMessage({ embed: {
				color: config.options.embedColour,
				title: "Invalid command",
				description: "Did you type the command correctly?"
			}});
		}

	}
}


function pad(ln, str) {
	return Array(ln - str.length).join(" ")
}

exports.usage = {
	main: "{prefix}{command}",
	args: "[command]",
	description: "Shows commands and aliases.",
	adminOnly: false,
	DJ: false
};