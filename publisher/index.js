// a simple publisher for all the jobs
const amqp = require('amqplib/callback_api');

module.exports = {
    pushToQueue: (queue, message) => {
        amqp.connect(process.env.AMQP_URI, function(error0, connection) {
            if (error0) {
                throw error0;
            }
    
            connection.createChannel(function(error1, channel) {
                if (error1) {
                    throw error1;
                }
    
                channel.assertQueue(queue, { durable: true });
                channel.sendToQueue(queue, JSON.stringify(message));
            });
        });
    }
}