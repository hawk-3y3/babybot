const sf = require('snekfetch')
const config = require('../config.json')
const ytk = config.ytapikey

async function search(query, type) {

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
    }

module.exports = {
    search,

}