const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },

    // should allow payments to be made to
    phone_number: {
        type: String,
        required: true,
        unique: true
    },

    is_verified: {
        type: Boolean,
        default: false
    },

    verification_code: {
        type: String,
        unique: true
    },

    // password
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('customer', customerSchema);