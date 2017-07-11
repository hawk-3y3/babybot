exports.run = function (client, msg, args) {

    let rx = /((?:\d*)d(?:\d+))/gi;
    let rx2 = /^(?:(\d*)d(\d+))/i
    let r = rx.test(args.join(' ')) ? args.join(' ').match(rx) : ['d20'];
    let result = new Array();
    let sum;

    r.forEach(d => {
        let data = d.match(rx2);
        let rolls = (/\d+/).test(data[1]) ? data[1] : 1;

        for (i = 0;i < rolls;i++){
            let res = Math.ceil(Math.random() * data[2]);
            result.push(res);
        }

    });
    sum = result.reduce((a, b) => a + b, 0);
    msg.channel.send({ embed: {
        color: client.config.options.embedColour,
        title: "Dice Roll",
        description: `Your rolls: ${result.join(', ')}.\nTotal sum: ${sum}.`
    }})

}
exports.help = () => {
    return "(number of dice)d(size of die)\n    rolls a d6 for you\n    Adding nDn will roll that many dice of that type.\n"
}
