const discord = require('discord.js');
const responseObject = require("./responses.json");
const fs = require('fs');

let client = null;
/* Global variables for connection control (discord.js has its own client reconnection handling but
it can sometimes fail, particularly when using the optional UWS peer dependency) */
// If the client is currently logging in
let loggingIn = false;
// Timeout after which to consider login failed and trigger the restart process
let startClock = false;
// Upon disconnect if client doesn't reconnect in time we will take over
let restartClock = null;

// Variables for the music bot part
var currentVoice;
var playlist = [];
var stopped = false;

module.exports = {
    startup() {

loggingIn = true;
setStartClock();

if (client) { client.bot.destroy(); }

client = {
    bot: new discord.Client(),
    config: require('./config.json'),
    cmdList:[]
    }

// Attempt to log the client in
client.bot.login(client.config.token)
    .then(() => {
        // Successfull log in so clear timers
        clearStartClock();
        clearRestartClock(true);
        console.log('login succesful');
        loggingIn = false;
    })
    .catch(() => {
        //log.info('login failed');
        loggingIn = false;
        restart();
    });

// Emitted when the bot client is ready (event emmited on succesful login and reconnections)
client.bot.on('ready', () => {
// Successfull log in or reconnection so clear timers
clearStartClock();
clearRestartClock(true);
});

// On reconnect attempts
client.bot.on('reconnecting', () => {
clearRestartClock(false);
console.log('reconnect attempt event');
});

// Emitted for general warnings
client.bot.on('warn', (warning) => {
    console.log('warning:'+ warning);
});

client.bot.on('message', message => {
	if (message.author.bot) return;
    if(responseObject[message.content]) {            
        message.channel.send(responseObject[message.content]);
	}
	if (!message.content.startsWith(client.config.prefix) && !message.content.startsWith(`<@${client.bot.user.id}>`)) return;

    let command;
    let args;

    if (message.content.startsWith(client.config.prefix)){
	    command = message.content.split(' ')[0];
	    command = command.slice(client.config.prefix.length);
	    args = message.content.split(' ').slice(1);
    } else if (message.content.startsWith(`<@${client.bot.user.id}>`)){
        command = message.content.split(' ')[1];
	    args = message.content.split(' ').slice(2);
        if(command === undefined) {
            message.channel.send(`for help with the commands try ${client.config.prefix}help.`)
            return
        }
    }
	// looks if the command is valid and executes it.
	try {
		if (client.cmdList.includes(command)){
			let commandFile = require(`./commands/${command}.js`);
			message.react("\u2611");
			commandFile.run(client, message, args);
		} else {
			message.channel.send(`${command} is not a valid command!`)
		}
	} catch (err) {
    	console.error(err);
	}
});
},};

// Clear the restart clock, success arguement to indicate if we need to also restart the clock
function clearRestartClock(success) {
    if (restartClock) {
        //log.debug('restart clock cleared');
        clearTimeout(restartClock);
        restartClock = null;
    }

    /* If we want to reset the timeout in the case that the client is actually making attempts to reconnect
    a false arguement should be passed */
    if (!success) {
        setRestartClock();
    }
}

// Clear start clock, this will be used upon succesful log in
function clearStartClock() {
    if (startClock) {
        //log.debug('start clock cleared');
        clearInterval(startClock);
        startClock = null;
    }
}

/* To be called to either restart the client in the case of failed reconnection handling, or to periodically
make sure that the client is attempting to log in */
function restart() {
    console.log('Restart called');
    if (loggingIn) {
        return;
    }
    loggingIn = true;
    if (client.bot.uptime === null) {
        console.log('info: Client connection failed, attempting to reconnect');
        if (client.bot !== null) {
            client.bot = null;
        }
        module.exports.startup();
    } else {
        console.log('warn: Client connection handling failed, destroying client, re-attempting connection...');
        client.bot.destroy()
            .then(() => {
                module.exports.startup();
            })
            .catch(() => {
                /* At this point the client has failed to connect, and it has also failed to destroy itself, the
                only remaining recourse is to entirely restart the process */
                process.exit(1);
            });
    }
}

/* Clock to be used when the client is reconnecting, the timeout here is much longer at 60 seconds to
give discord.js's client reconnection handling a chance, every time the client makes some indication
it is at least attempting to reconnect this clock will be restarted. If 60 seconds pass with no indication
then the restart function will take over */
function setRestartClock() {
    if (!restartClock) {
        console.log('debug: restart clock started');
        restartClock = setTimeout(restart, 60000);
    }
}

/* Start a clock on login attempts, make call restart regularly to make sure the client is attempting to
log in */
function setStartClock() {
    if (!startClock) {
        console.log('debug: start clock started');
        startClock = setInterval(restart, 3000);
    }
}


// This loop reads the /commands/ folder and makes an entry for each command used for command validation.
fs.readdir('./commands/', (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
    	let commandFile = require(`./commands/${file}`);
		client.cmdList.push(file.split('.')[0])
        delete require.cache[require.resolve(`./commands/${file}`)];
		});
	});





