exports.run = (client, message, args) => {
const discord = require('discord.js');
const packageFile = require('../package.json');
const pusage = require('pidusage');
const bot = client;
const start = Date.now();

let uptime = "";

let x;
let ms = bot.uptime;

switch (true) {
    case ms >= 3600000*24:
        uptime = Math.floor(ms / (3600000*24)) + ' day(s)'
        break;
    
    case ms >= 3600000:
        uptime = Math.floor(ms / 3600000) + ' hrs'
        break;
    
    case ms >= 60000:
        uptime = Math.floor(ms / 60000) + ' min'
        break;

    case ms >= 1000:
        uptime = Math.floor(ms / 1000) + ' sec'
        break;

    default:
        uptime = ms + ' ms'
        break;
}

function system() {
    return new Promise((resolve, reject) => {
        pusage.stat(process.pid, (err, stat) => {
            if (err) {
                //  log.warn(`PUsage lookup failed, ${err}`);
                reject('PUsage lookup failed');
            }
            pusage.unmonitor(process.pid);
            resolve(stat);
        });
    });
};


Promise.all([system()])
    .then((result) => {
        const embed = new discord.RichEmbed()
            .setAuthor('Bot Statistics', bot.user.avatarURL)
            .setColor('#0275ea')

            .addField('\u200b', '\u200b', true)
            .addField('\u200b', '__General Bot Stats__', true)
            .addField('\u200b', '\u200b', true)
            .addField('Servers', `${bot.guilds.size} guilds`, true)
            .addField('Channels', bot.channels.size, true)
            .addField('Users', bot.users.size, true)

            .addField('\u200b', '\u200b', true)
            .addField('\u200b', '__Process Details__', true)
            .addField('\u200b', '\u200b', true)
            .addField('CPU Usage', `${result[0].cpu.toFixed(2)}%`, true)
            .addField('Memory Usage', `${Math.round(result[0].memory / 1000000)}MB`, true)
            .addField('Uptime', uptime, true)

            .addField('\u200b', '\u200b', true)
            .addField('\u200b', '__Technical Specs__', true)
            .addField('\u200b', '\u200b', true)
            .addField(client.user.username + ' Version', `${packageFile.version}`, true)
            .addField('Node Version', `${process.version}`, true)
            .addField('discord.js Version', `${packageFile.dependencies['discord.js']}`, true)

            .setFooter(`Generated in ${Date.now() - start}ms`);

        message.channel.send({embed})
            .catch((err) => { 
                console.log(`Failed to send embed, ${err}`); });
            })
            .catch((err) => {
                console.log(`reject in Promise.all, ${err}. in botstats.js`)
            });
    
}