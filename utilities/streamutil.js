const ytutil = require("./ytutil.js");
const ytdl   = require("ytdl-core");
const buffer = require("buffered2").BufferedStream;

exports.play = async function play(guild, client) {

	if (!client.bot.guilds.has(guild.id) ||	!client.bot.voiceConnections.has(guild.id) || !client.bot.voiceConnections.get(guild.id).channel.id || client.bot.voiceConnections.get(guild.id).dispatcher) return;

	if (guild.queue.length === 0) {
		if (client.bot.voiceConnections.get(guild.id) && client.bot.voiceConnections.get(guild.id).channel.id) client.bot.voiceConnections.get(guild.id).disconnect(); 
		return client.bot.channels.get(guild.messageChannel).send({ embed: {
			color: client.config.options.embedColour,
			title: "Playback finished",
			description: `Use ${client.prefixes[guild.id]}play or ${client.prefixes[guild.id]}p to queue some music`,
		}});
	}

	let song;

	if (guild.queue[0].src === "youtube") {
		guild.queue[0].duration = await ytutil.getDuration(guild.queue[0].id);

		let res = await ytutil.getFormats(guild.queue[0].id);
		if (!res.url) {
			guild.queue.shift();
			client.bot.channels.get(guild.messageChannel).send({ embed: {
				color: client.config.options.embedColour,
				title: "This song is unplayable"
			}});
			return exports.play(guild, client);
		} else {
			song = new buffer();
			ytdl(guild.queue[0].id, { filter: "audioonly" }).pipe(song);
		}
	} else {
		song = guild.queue[0].id
	}

	client.bot.channels.get(guild.messageChannel).send({embed: {
		color: client.config.options.embedColour,
		title: "Now Playing",
		description: `[${guild.queue[0].title}](https://youtu.be/${guild.queue[0].id})`,
		footer: {
			text: `Requested by ${client.bot.users.get(guild.queue[0].req) ? `${client.bot.users.get(guild.queue[0].req).username}#${client.bot.users.get(guild.queue[0].req).discriminator}` : "Unknown"}`
		}
	}});

	client.bot.voiceConnections.get(guild.id).playStream(song);
	setTimeout( function() {
		if (client.bot.voiceConnections.get(guild.id).dispatcher && client.volume[guild.id]) client.bot.voiceConnections.get(guild.id).dispatcher.setVolume(client.volume[guild.id]);
	}, 500);

	if (!client.bot.voiceConnections.get(guild.id).dispatcher) return client.bot.voiceConnections.get(guild.id).disconnect();
	
	client.bot.voiceConnections.get(guild.id).dispatcher.on("end", () => {
		if (guild.repeat === "All") guild.queue.push(guild.queue[0]);
		if (guild.repeat !== "Current") guild.queue.shift();
		guild.svotes = [];
		exports.play(guild, client);
	});

	client.bot.voiceConnections.get(guild.id).on("disconnect", () => {
		client.bot.voiceConnections.forEach(vc => {
			if (vc.dispatcher) {
				if (!vc.dispatcher.paused) {
					setTimeout( function() {
						vc.dispatcher.pause();
						setTimeout( function() {
							vc.dispatcher.resume();
						}, 250);
					}, 100);
				}
			}
		})
	})
};
