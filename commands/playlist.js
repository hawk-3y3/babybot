const ytutil           = require("../utilities/ytutil.js");
const sthandle         = require("../utilities/streamutil.js");
const scutil = []

const ytrx = new RegExp("(?:youtube\\.com.*(?:\\?|&)(?:v|list)=|youtube\\.com.*embed\\/|youtube\\.com.*v\\/|youtu\\.be\\/)((?!videoseries)[a-zA-Z0-9_-]*)");

exports.run = async function (client, message, args) {
	
	if(permissions.isBlocked(message.member)) return message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "Denied",
		description: `Your permissions to use ${client.bot.user.username} on this server are revoked.`
	}});

	if (!args[0]) return message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "You need to specify what to play",
		description: "YouTube: Search Term, URL or Playlist URL\nSoundCloud: URL"
	}});

	if (!client.bot.voiceConnections.get(message.guild.id)) {
		if (!message.member.voiceChannelID)
			return message.channel.send({ embed: {
				color: client.config.options.embedColour,
				title: "Join a voicechannel first",
			}});

		if (!message.guild.channels.get(message.member.voiceChannelID).permissionsFor(client.bot.user).has("CONNECT") || !message.guild.channels.get(message.member.voiceChannelID).speakable)
			return message.channel.send({ embed: {
				color: client.config.options.embedColour,
				title: "Unable to Connect",
				description: "This channel doesn't allow me to connect/speak."
			}});


		const voice = await message.member.voiceChannel.join()
		.catch(e => {
			message.channel.send({ embed: {
				color: client.config.options.embedColour,
				title: "Unable to Connect",
				description: e.message
			}});
		});

		voice.on("disconnect", () => {
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
		});

		client.queues[message.guild.id].dj = message.author.id;

		if (!client.bot.voiceConnections.get(message.guild.id) || !client.bot.voiceConnections.get(message.guild.id).channel.id) return;

	} else if (message.member.voiceChannelID !== client.bot.voiceConnections.get(message.guild.id).channel.id)
		return message.channel.send({ embed: {
			color: client.config.options.embedColour,
			title: "Join my voicechannel to queue.",
		}});

	let guild = client.queues[message.guild.id];
	guild.messageChannel = message.channel.id;

	if (guild.queue.length >= client.config.options.maxQueue) return message.channel.send({ embed: {
		color: client.config.options.embedColour,
		title: "Queue Limit Reached",
		description: "You've hit the queue limit. Wait for the queue to deplete before queueing more songs."
	}})

	const query = args.join(" ").replace(/<|>/g, "");
	const ytrxm = query.match(ytrx);

	let res = {};

	if (!ytrxm || !ytrxm[1]) {

		if (!client.config.keys.ytapikey) {
			if (client.bot.voiceConnections.get(message.guild.id).channel.id && guild.queue.length === 0) client.bot.voiceConnections.get(message.guild.id).disconnect();
			return message.channel.send({ embed: {
				color: client.config.options.embedColour,
				title: "No YouTube key specified",
				description: "No YouTube key was configured in 'config.json'. YouTube not available."
			}});
		};

        res.src = "youtube";
		res.type = "search";
		res.items = await ytutil.search(query, "playlist");

	} else {

		if (ytrxm && ytrxm[1]) {

			if (!client.config.keys.ytapikey) {
				if (client.bot.voiceConnections.get(message.guild.id).channel.id && guild.queue.length === 0) client.bot.voiceConnections.get(message.guild.id).disconnect();
				return message.channel.send({ embed: {
					color: client.config.options.embedColour,
					title: "No YouTube key specified",
					description: "No YouTube key was configured in 'config.json'. YouTube not available."
				}});
			};

            res.src = "youtube";
			res.type = "playlist";
			res.items = await ytutil.getPlaylist(ytrxm[1], (/^--shuffle$|^-sh$/i).test(args[0]) ? Infinity : "15");
			if ((/^--shuffle$|^-sh$/i).test(args[0])) res.items = ytutil.shuffle(res.items);

		}
	};

	if (res.items.length === 0) {
		if (client.bot.voiceConnections.get(message.guild.id).channel.id && guild.queue.length === 0) client.bot.voiceConnections.get(message.guild.id).disconnect();
		return message.channel.send({ embed: {
			color: client.config.options.embedColour,
			title: "No results found",
		}});
	};

	if (res.type !== "search") {

		res.items.map(v => guild.queue.push({ id: v.id, title: v.title, req: message.author.id, src: res.src, durl: (res.src === "soundcloud" ? scrxm[1] : undefined) }));
		let embed = {
			color: client.config.options.embedColour,
			title: `Enqueued`,
			description: `${res.items[0].title}`
		}
		if (res.type === "playlist") embed.footer = {text: `...and ${res.items.slice(1).length} songs.`};

		message.channel.send({ embed: embed });

	} else {

		let src = await message.channel.send({ embed: {
			color: client.config.options.embedColour,
			title: "Select Playlist",
			description: res.items.map((v, i) => `**${i + 1}.** ${v.snippet.title}`).join("\n"),
			footer: {
				text: "1 to 9 || c to cancel selection"
			}
		}});

		const collector = await message.channel.awaitMessages(m => m.author.id === message.author.id && message.guild && ((parseInt(m.content) && m.content >= 1 && m.content <= res.items.length) || m.content.toLowerCase().startsWith(client.queues[message.guild.id] + "p") || m.content === "c"), {
			maxMatches: 1,
			time: 10000
		}).catch(e =>{
			return src.edit({ embed: {
				color: client.config.options.embedColour,
				title: `Too slow`,
				description: `You took more than 10 seconds to select`,
			}});
		})

		if (collector == undefined) return;

		if (!collector.first() || collector.first().content.toLowerCase().startsWith(client.prefixes[message.guild.id] + "p") || collector.first().content === "c") {
			if ((!collector.first() || collector.first().content === "c") && client.bot.voiceConnections.get(message.guild.id).channel.id && guild.queue.length === 0) client.bot.voiceConnections.get(message.guild.id).disconnect();
			return src.delete();
		};

		if (message.channel.permissionsFor(client.bot.user).has('MANAGE_MESSAGES')) collector.first().delete();

        res.songs = await ytutil.getPlaylist(res.items[collector.first().content - 1].id.playlistId, (/^--shuffle$|^-sh$/i).test(args[0]) ? Infinity : "15"); 
		if ((/^--shuffle$|^-sh$/i).test(args[0])) res.songs = ytutil.shuffle(res.songs);
		res.songs.map(v => guild.queue.push({ id: v.id, title: v.title, req: message.author.id, src: res.src }));

		src.edit({embed: {
			color: client.config.options.embedColour,
			title: `Enqueued`,
			description: `${res.items[collector.first().content - 1].snippet.title} - **Playlist**`,
			footer: {
				text: `Requested by ${message.author.username}#${message.author.discriminator}`
			}
		}});

	};

	sthandle.play(guild, client);

}

exports.usage = {
	main: "{prefix}{command}",
	args: "[--shuffle | -sh] <YouTube Playlist Search/Playlist URL>",
	description: "Queue a YT Playlist. Use `--shuffle` or `-sh` to shuffle before queuing",
	adminOnly: false,
	DJ: false
};