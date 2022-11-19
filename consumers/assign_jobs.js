// a consumer for assigning jobs
const amqp = require('amqplib/callback_api');
const { MerchantModel, JobModel, MerchantLocationModel } = require('../models');

const QUEUE = process.env.ASSIGN_JOBS_QUEUE;

amqp.connect(process.env.AMQP_URI, function(error0, connection) {
    if (error0) {
        throw error0;
    }

    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        channel.assertQueue(QUEUE, { durable: true });
        
        channel.consume(queue, async function(msg) {
            const { jobRefId } = JSON.parse(msg.content);

            // get the job
            const job = await JobModel.findOne({ _id: jobRefId })

            if (job) {
                // run the assignment algorithm here
                // find the current location for the merchant
                // find all the latest records where the merchant is online ( active :) )
                // take the latest position :) ( we dont have to draw a line to from where they are, we just track their current position )
                const merchants = await MerchantLocationModel.aggregate([
                    {
                        $match: {
                            is_available: true,
                            $near: {
                                $geometry: {
                                    type: "Point",
                                    coordinates: job.location
                                },
        
                                $maxDistance: 10000, // 10 km
                                $minDistance: 0 // 0 m
                            }
                        }
                    }
                ]);

                // if a merchant has been found just use it
                if (merchants.length) {
                    await JobModel.findOneAndUpdate({ _id: jobRefId }, {
                        merchant: merchants[0]?._id,
                        status: 'assigned'
                    });

                    // send a notification to the frontend for the change

                } else {
                    // send a rejection notification to the frontend
                }
            }

            channel.ack(msg);
        }, { noAck: false });
    });
});