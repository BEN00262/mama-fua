const mongoose = require('mongoose');

const merchantLocationSchema = new mongoose.Schema({
    merchant: {
        type: mongoose.Types.ObjectId,
        ref: 'merchant'
    },
    
    // pick the current location of the customer who posted the job
    location: { type: [Number], index: { type: '2dsphere', sparse: true}}
}, { 
    timeseries: {
        timeField: "timestamp",
        metaField: "metadata",
        granularity: "minutes"
    } 
});

module.exports = mongoose.model('merchant_location', merchantLocationSchema);