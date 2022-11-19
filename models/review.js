const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    stars: {
        type: Number,
        required: true
    },

    // not really required
    comment: {
        type: String
    },

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

module.exports = mongoose.model('review', reviewSchema);