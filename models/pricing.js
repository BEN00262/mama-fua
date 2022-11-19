const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true
    },

    additional_supplies_cost: {
        type: Number,
        required: true
    },

    basin_size: {
        type: String,
        default: 'standard',
        enum: ['standard', 'large', 'xlarge'],
        unique: true
    },

    // might be required later on
    description: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('pricing', pricingSchema);