exports.run = (message, args) => {
const request = require('request')
const config = require('../config.json') 

let u = 'http://api.giphy.com/v1/gifs/random?api_key='+ config.keys.gfykey + '&tag='
let tags = ""
//let r = u + "?api_key=" + config.gfykey + '&tag='

if (args[0] !== undefined) {
	  for (var index = 0; index < args.length; index++) {
  	  	var element = args[index];  
  		  u += element + "+"
        tags += element + ", "
  	}
	  u = u.slice(0,-1)
    tags = tags.slice(0,-2)
    } else {
    u = u.slice(0,-4)
    tags += "***random***"
  }
  
request(u, function (error, response, gfyBody) {
    if (error) {console.log('error:', error);} // Print the error if one occurred
    if (response.statusCode !== 200) {console.log('statusCode:', response && response.statusCode);} // Print the response status code if a response was received
    data = JSON.parse(gfyBody);
    // console.log('gfyBody:',data); // Print the content of the returned data.

    if(data == null){
        console.log("no results found")
        message.channel.send('no results found for ' + tags + ' !')
        return
    }
    
let embed = {
  "color": 0,
  "timestamp": new Date(),
  "url":data.data.image_url,
  "footer": {
    "text": "tags: " + tags
  },
  "image": {
    "url": data.data.image_url
  },
  "author": {
    "name": "GFY random"
  }
};

message.channel.send({ embed });
});
}

exports.usage = {
	main: "{prefix}{command}",
	args: "[searcg tags]",
	description: "searches gifs on GFY",
	adminOnly: false,
	DJ: false
};