const mongoose = require('mongoose');

const cancellationSchema = new mongoose.Schema({
    reason: {
        type: String
    },

    // reasons for cancellation by what client, to what merchant, for what job
    customer: {
        type: mongoose.Types.ObjectId,
        ref: 'customer'
    },

    merchant: {
        type: mongoose.Types.ObjectId,
        ref: 'merchant'
    },

    job: {
        type: mongoose.Types.ObjectId,
        ref: 'job'
    }
}, { timestamps: true });

module.exports = mongoose.model('cancellation', cancellationSchema);