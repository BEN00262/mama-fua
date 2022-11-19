const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema({
    job: {
        type: mongoose.Types.ObjectId,
        ref: 'job'
    },

    merchant: {
        type: mongoose.Types.ObjectId,
        ref: 'merchant'
    },

    how_much: {
        type: Number,
        required: true
    },

    mpesa_reference: {
        type: String,
        required: true,
        unique: true
    },

    is_settled: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('settlement', settlementSchema);