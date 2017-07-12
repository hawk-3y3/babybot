exports.run = (client, message, args) => {
        // Firstly we will need to send a response to the original command
        message.channel.send('pong')
            .then((secondMessage) => {
                // console.log('Succesfully sent pong message');
                editPong(message, secondMessage);
            })
            .catch((err) => {
                console.log(`Failed to send pong message, ${err}`);
            });
}


/* After the "pong" response has succesfully sent we will use the difference in discord timestamps of
the messages to calculate pingtime */
function editPong(message, secondMessage) {
    // Calculate pingtime in milliseconds
    const ms = secondMessage.createdTimestamp - message.createdTimestamp;

    // Determine the status of the pingtime
    let status = '';
    if (ms < 50) {
        status = '(Excellent)';
    } else if (ms < 100) {
        status = '(Very Good)';
    } else if (ms < 300) {
        status = '(Good)';
    } else if (ms < 1000) {
        status = '(Mediocre)';
    } else {
        status = '(Bad)';
    }

    // Edit the reply from "pong" to the !ping response message
    secondMessage.edit(`Ping: ${ms}ms ${status}`)
        .then(() => {
            // console.log('Succesfully editted pong message, !ping complete');
        })
        .catch((err) => {
            console.warn(`Failed to edit pong message, ${err}`);
        });
}
exports.usage = {
	main: "{prefix}{command}",
	args: "",
	description: "returns ping from the bot to the server",
	adminOnly: false,
	DJ: false
};