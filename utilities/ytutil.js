const sf  = require("snekfetch");
const yt  = require("ytdl-core");
const fs  = require('fs')
const ytk = require("../config.json").keys.ytapikey;

module.exports = {

	async search(query, type) {

		let results = await sf.get("https://www.googleapis.com/youtube/v3/search").query({
			part       : "snippet",
			maxResults : "9",
			type       : type,
			q          : query,
			key        : ytk
		}).catch(err => {
			return [];
		})

		return results.body.items;
	},

	async getPlaylist(id, limit, page = "", videos = []) {

		let req = await sf.get('https://www.googleapis.com/youtube/v3/playlistItems').query({
			maxResults    : "50",
			part          : "snippet",
			nextPageToken : null,
			pageToken     : page,
			playlistId    : id,
			key           : ytk
		}).catch(err => {
			return videos;
		});

		if (!req || !req.body || req.body.items.length === 0)
			return videos;

		for (let video of req.body.items) {
			if (Object.keys(video.snippet).length === 0 && video.snippet.constructor === Object) continue;
			videos.push({ id: video.snippet.resourceId.videoId, title: video.snippet.title });
		}

		if (videos.length >= limit) return videos.slice(0, limit);

		if (req.body.nextPageToken) return await module.exports.getPlaylist(id, limit, req.body.nextPageToken, videos);
		return videos;
	},

	async getRelated(id, guild) {

		let related = await sf.get("https://www.googleapis.com/youtube/v3/search").query({
			part       : "snippet",
			maxResults : "5",
			relatedToVideoId: id,
			type	   : "video",
			key        : ytk
		}).catch(err => {
			return [];
		})
		let index = Math.floor((Math.random() * related.body.items.length))
		
		related = related.body.items[index]
		guild.queue.push({ id: related.id.videoId, title: related.snippet.title, req: client.bot.user.id, src: "youtube" });
	},

	async videoInfo(id) {

		let result = await sf.get("https://www.googleapis.com/youtube/v3/videos").query({
			part : "snippet",
			id   : id,
			key  : ytk
		}).catch(err => {
			return [];
		})

		if (result.body.items.length === 0) return [];
		return [{ id: result.body.items[0].id, title: result.body.items[0].snippet.title }];
	},

	async getFormats(id) {

		let sinfo = await yt.getInfo(id).catch(err => { return { url: "" } });

		if (!sinfo || !sinfo.formats)
			return { url: "" }

		for (let i = 0; i < sinfo.formats.length; i++) {

			if ((sinfo.formats[i].itag === "249" || sinfo.formats[i].itag === "250" || sinfo.formats[i].itag === "251") || (sinfo.formats[i].audioEncoding)) {
				return { url: sinfo.formats[i].url };
			}

		}

		return { url: "" };
	},

	async getDuration(id) {

		let req = await sf.get('https://www.googleapis.com/youtube/v3/videos').query({
			part : 'contentDetails',
			id   : id,
			key  : ytk
		}).catch(err => {
			return 0;
		});

		if (!req || !req.body || req.body.items.length === 0)
			return 0;

		return module.exports.getSeconds(req.body.items[0].contentDetails.duration);
	},

	getSeconds(duration) {
		
		let match   = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
		if(!match)  return 0;
		let hours   = (parseInt(match[1]) || 0) * 3600;
		let minutes = (parseInt(match[2]) || 0) * 60;
		let seconds =  parseInt(match[3]) || 0;

		return hours + minutes + seconds;
	},

	shuffle(array) {

		var m = array.length, t, i;
		while (m) {
			i = Math.floor(Math.random() * m--);

			t = array[m];
			array[m] = array[i];
			array[i] = t;
		}

		return array.slice(0, 25);
	}
}