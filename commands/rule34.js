exports.run = (message, args) => {
if(!message.channel.nsfw && message.channel.type !== 'dm') {
    message.channel.send("that's not allowed arround here!")
    return
}

const request = require('request')
const u = 'http://rule34.xxx//index.php?page=dapi&s=post&q=index&'
let rule = u
let tags = ""

if (args[0] !== undefined) {
    rule += "tags="
	for (var index = 0; index < args.length; index++) {
        var element = args[index]  
        rule += element + "+"
        tags += element + ", "
    }
    rule = rule.slice(0,-1)
    tags = tags.slice(0,-2)      
} else {
        rule = rule + "tags=random"
        tags += "random"    
}
request(rule, function (error, response, rule34Body) {
    if (error) {console.log('error:', error)} // Print the error if one occurred
    if (response.statusCode !== 200) {console.log('statusCode:', response && response.statusCode);} // Print the response status code if a response was received
    var pool = rule34Body.match(/\/\/img\.rule34\.xxx\/(\bimages\b)\/[0-9]+\/\w+\.(?:png|jpg|jpeg|gif|png|svg)/g);
    if(pool == null){
        console.log("no results found")
        message.channel.send('no results found for ' + tags + ' !')
        return
    }
    var index = Math.floor(Math.random() * pool.length)
    var img = "http:" + pool[index]
    // console.log("posting: " + img);
    // console.log("picked #"+ index  + " out of "  + pool.length + " results");

    let embed = {
        "color": 0,
        "timestamp": new Date(),
        "url": img,
        "footer": {
            "text": "picked #"+ index  + " out of "  + pool.length + " results, tags: " + tags
        },
        "image": {
            "url": img
        },
        "author": {
            "name": "rule 34 (link)"
    }
}

message.channel.send({ embed })
})
}

exports.usage = {
	main: "{prefix}{command}",
	args: "<search tags>",
	description: "searches lewd images on rule34.xxx",
	adminOnly: false,
	DJ: false
};