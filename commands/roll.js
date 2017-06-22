exports.run = (client, message, args) => {
    let input = (args[0] == null) ? ['1d6'] : args;
    let data
    
    data = rollDie(input)

    if (data == null){
        message.channel.send(`invalid die format, try 1d6`).catch(console.error);
        return
    }
    
    message.channel.send(`You rolled ${data}.`).catch(console.error);
    
    data = multiCheck(data)

    if(!data){
        return
    } else {
    message.channel.send(`total: ${data} !`).catch(console.error);
    }
}

exports.help = () => {
    return "(number of dice)d(size of die)\n    rolls a d6 for you\n    Adding nDn will roll that many dice of that type.\n"
}

function rollDie(input) {
    let data = ""
    let dice
    let i

    for (var index = 0; index < input.length; index++) {
        var element = input[index];   
        i = 0

        dice = resolveDie(element)

        if (dice == null){
            return
        }

        while (i < dice.dice[1]) {
            i++
            data += Math.ceil(Math.random() * dice.dice[2])
            if (i != dice.dice[1]){
                data += ", "
            }
        }
        if (index + 1 < input.length){
            data += ", "
        }
    }
    return data
}

function resolveDie(die) {
    let dieData = {
        text: ""
    }

    dieData.dice = /(\d+)[d,D](\d+)/g.exec(die)

    if (dieData.dice == null) {
        dieData.dice = /[d,D](\d+)/g.exec(die)
        if (dieData.dice == null) {
            return null
        }
        dieData.dice.splice(1, 0, 1);
    }

    console.log(dieData)

    return(dieData)
}

function multiCheck(input){
    let numbers = input.split(',').map(function(item) {
        return parseInt(item, 10);
    });

    if (numbers.length > 1) {        
        return sum(numbers)
        
    }
    return false
}

function sum(numbers){
    return numbers.reduce(function (a, b) { return a + b; }, 0);
}