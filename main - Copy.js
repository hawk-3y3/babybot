const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const fs = require('fs');
const sql = require('sqlite');
sql.open('./score.sqlite');


client.on('ready', () => {
    console.log('I am ready!');
});


// This handles commands from messages

client.on('message', message => {
    // Breaking out if the message does not start with the prefix, or is posted by a bot.
    if (message.channel.type !== 'text'|| message.author.bot) return;
    
    sql.get(`SELECT * FROM scores WHERE userId ='${message.author.id}'`).then(row => {
    if (!row) {
        sql.run('INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)', [message.author.id, 1, 0]);
    } else {
        let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1));
        if (curLevel > row.level) {
        row.level = curLevel;
        sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE userId = ${message.author.id}`);
        message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
    }
    sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userId = ${message.author.id}`);
    }
        }).catch(() => {
        console.error;
        sql.run('CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, level INTEGER)').then(() => {
        sql.run('INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)', [message.author.id, 1, 0]);
        });
    });

    if (!message.content.startsWith(config.prefix)) return;
    if (message.content.startsWith(config.prefix + 'level')) {
        sql.get(`SELECT * FROM scores WHERE userId ='${message.author.id}'`).then(row => {
        if (!row) return message.reply('Your current level is 0');
            message.reply(`Your current level is ${row.level}`);
        }
    );
    } else
    if (message.content.startsWith(config.prefix + 'points')) {
        sql.get(`SELECT * FROM scores WHERE userId ='${message.author.id}'`).then(row => {
        if (!row) return message.reply('sadly you do not have any points yet!');
            message.reply(`you currently have ${row.points} points, good going!`);
        }
    );
}


    if (message.content.startsWith(config.prefix + 'ping')) {
        message.channel.send('pong!');
    }

    if (message.content.startsWith(config.prefix + 'foo')) {
        message.channel.send('bar!');
    }
    if(message.content.startsWith(config.prefix + 'prefix')) {
        // Gets the prefix from the command (eg. "!prefix +" it will take the "+" from it)
        let newPrefix = message.content.split(' ').slice(1, 2)[0];
        // change the configuration in memory
        config.prefix = newPrefix;
        // Now we have to save the file.
        fs.writeFile('./config.json', JSON.stringify(config), (err) => {if (err) console.error(err)});
        // Sending a message to confirm the new prefix
        message.channel.send("The new prefix is " + newPrefix + " !");
    }

    if (message.channel.type === 'dm') return; // Ignore DM channels.



});



client.login(config.token);
