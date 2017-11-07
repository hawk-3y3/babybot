const timeParser = require("../utilities/timeparser.js");
const nowPlaying = require("../commands/nowplaying")


exports.run = function (message, args) {
    if (client.queues[message.guild.id].queue.length <= 1){return nowPlaying.run(message, args)
		};


	let guild = client.queues[message.guild.id];

	let page = parseInt(args[0]) ? parseInt(args[0]) : 1;
	let maxPage = Math.ceil(guild.queue.slice(1).length / 10);

	if (page < 1)       page = 1;
	if (page > maxPage) page = maxPage;

	let startQueue = ((page - 1) * 10) + 1;
	let endQueue   = startQueue + 10 > guild.queue.length ? guild.queue.length : startQueue + 10;

	let song = guild.queue[0];
	

	let embed = {
		color       : client.config.options.embedColour,
		title       : song.title,
		url         : `https://youtu.be/${song.id}`,
		description : `${timeParser.formatSeconds(client.bot.voiceConnections.get(message.guild.id).dispatcher.time / 1000)}${song.src === "youtube" ? "/" + timeParser.formatSeconds(song.duration) : ""}\n`,
		fields: [
			{
				name: `Queue${guild.auto ? ", Autoplay ON": ""}${!guild.repeat? "" : `, Repeating ${guild.repeat}`}`,
				value: guild.queue.slice(startQueue, endQueue).map((item, i) => `${startQueue + i}. ${item.title} - ${client.bot.users.get(item.req) ? `<@${client.bot.users.get(guild.queue[startQueue + i].req).id}>` : "**Unknown**"}`).join("\n")
			}
		],
		footer: {
			text: `Page ${page}/${maxPage}`
		}
	};

	message.channel.send({ embed: embed }).catch(e => {
		console.warn(e)
	});

}

exports.usage = {
	main: "{prefix}{command}",
	args: "<page number>",
	description: "View the specified queue page",
	adminOnly: false,
	DJ: false
};

