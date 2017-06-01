exports.run = (client, message, args) => {
    let result = "The results are: ";
    let n = (isNaN(args[0])) ? 1 : args[0];
    let i = 0;
    
    // changes the text for when a single coin is flipped
    if (n == 1){        
        result = result.replace("s are", " is");        
    }

    // Flips multiple coins if an additional argument was passed
    do {
        i++;
        if (Math.random()*2 <= 1) {
            result += "heads, ";
        } else {
            result += "tails, ";
        }
        if (i == n) {
            result = result.slice(0, -2);
            result += " !"
        }
    } while (i < n);

    message.channel.send(result).catch(console.error);
}

exports.help = () => {
    return "(number of coins)\n    flips coins for you\n    Adding (number) will flip that many coins.\n"
}