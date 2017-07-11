/*
* This is a discord bot build by copying and converting ava-discordbot then tailoring it for my personal use
*
* You can find the source this is based on at:
* https://github.com/JamesLongman/ava-discordbot
*/


const fs = require('fs');
const package = require('./package.json')

// Checks for a config file otherwise creates a template

if (!fs.existsSync('./config.json')) {
    console.log('config file not found, a template will be provided')
    createTemplate()
} else {
    // actually starts the bot and keeps it running
    console.log('config file found')
    console.log(`initializing bot, version: ${package.version}`)
    let bot = require('./bot.js')
    bot.startup()
}

// creates a template to load your credentials from

function createTemplate() {
    let stream = fs.createWriteStream("config.json");
    stream.once('open', function(fd) {
    stream.write(`{"token":"",\n"botuserid":"",\n"prefix":"/",\n"ownerID":"",\n"gfykey":"",\n "yt-apikey":"",\n "botId":""}`);
    stream.end();
    console.log('template build please supply it with your credentials')
    });
}