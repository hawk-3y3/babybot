exports.run = (client, message, args) => {
    let result = "You rolled ";
    let input = (args[0] == null) ? ['1d6'] : args;
    let dice
    let i
    
    for (var index = 0; index < input.length; index++) {
        var element = input[index];   
        i = 0
        dice = /(\d+)[d,D](\d+)/g.exec(element)

        if (dice == null) {
            dice = /[d,D](\d+)/g.exec(element)
            dice.splice(1, 0, 1);
        }

        if(dice[1] == 1){
            result += "a "
        }
        while (i < dice[1]) {
            i++
            result += Math.ceil(Math.random() * dice[2])
            if (i !== dice[1]){
                result += ", "
            }
        }
    }
    
    message.channel.send(result).catch(console.error);
}

exports.help = () => {
    return "(number of dice)d(size of die)\n    rolls dice for you\n    Adding nDn will roll that many dice.\n"
}