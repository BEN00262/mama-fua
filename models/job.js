const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    status: {
        type: String,
        default: 'posted',
        enum: ['posted', 'assigned', 'rejected', 'claimed', 'done']
    },

    // how much the client is paying for the job
    // should we give the client this ability ... really ?
    // this cost is computed at the top
    // computed during job creation
    cost: {
        type: Number,
        required: true
    },
    
    // this adds to the cost of the job
    bring_own_supplies: {
        type: Boolean,
        default: false
    },

    // how many basins are we talking about ?
    // cost is computed price per basin x # basins
    basins: {
        type: Number,
        default: 1
    },

    customer: {
        type: mongoose.Types.ObjectId,
        ref: 'customer'
    },

    merchant: {
        type: mongoose.Types.ObjectId,
        ref: 'merchant'
    },
    
    // pick the current location of the customer who posted the job
    location: { type: [Number], index: { type: '2dsphere', sparse: true}}
}, { timestamps: true });

module.exports = mongoose.model('job', jobSchema);