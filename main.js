const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const responseObject = require("./responses.json");
const fs = require('fs');

let cmdList = [];

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir('./events/', (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
    	let eventFunction = require(`./events/${file}`);
    	let eventName = file.split('.')[0];
    	// super-secret recipe to call events with all their proper arguments *after* the `client` var.
    	client.on(eventName, (...args) => eventFunction.run(client, ...args));
		});
	});

// This loop reads the /commands/ folder and makes an entry for each command.
fs.readdir('./commands/', (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
    	let commandFile = require(`./commands/${file}`);
		cmdList.push(file.split('.')[0])
		});
	});



client.on('message', message => {
	if (message.author.bot) return;
        if(responseObject[message.content]) {            
            message.channel.send(responseObject[message.content]);
		}
		if (!message.content.startsWith(config.prefix)) return;

		let command = message.content.split(' ')[0];
		command = command.slice(config.prefix.length);
		let args = message.content.split(' ').slice(1);
		// looks if the command is valid and executes it.
		try {
			if (cmdList.includes(command)){
				let commandFile = require(`./commands/${command}.js`);
				message.react("\u2611");
				commandFile.run(client, message, args, cmdList);
			} else {
				message.channel.send(`${command} is not a valid command!`)
			}
		} catch (err) {
    		console.error(err);
		}
	});

client.login(config.token);