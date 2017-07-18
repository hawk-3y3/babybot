exports.run = (message, args) => {
let embed = {
  "url": "https://discordapp.com",
  "color": 0,
  "timestamp": new Date(),
  "footer": {
    "text": "footer text"
  },
  "image": {
    "url": "http://random.cat/i/untitled.png"
  },
  "author": {
    "name": "test embed"
  }
};

message.channel.send({ embed });
}