const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const responseObject = require("./responses.json");
const fs = require('fs');

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

client.on('message', message => {
  if (message.author.bot) return;
        if(responseObject[message.content]) {            
            message.channel.send(responseObject[message.content]);
  }
  if (!message.content.startsWith(config.prefix)) return;

  let command = message.content.split(' ')[0];
  command = command.slice(config.prefix.length);
  let args = message.content.split(' ').slice(1);
  // The list of if/else is replaced with those simple 2 lines:
  try {
    let commandFile = require(`./commands/${command}.js`);
    message.react("\u2611");
    commandFile.run(client, message, args);
  } catch (err) {
    console.error(err);
  }
});

client.login(config.token);