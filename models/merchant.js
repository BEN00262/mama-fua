const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
    merchant_reference: {
        type: String,
        required: true,
        unique: true
    },

    fullname: {
        type: String,
        required: true
    },

    // we need a profile pic for accountability purposes
    profile_picture: {
        type: String,
        required: true
    },

    // the merchant has to be contacted and pass a true test to prove that they are who they say they are
    is_verified: {
        type: Boolean,
        default: false
    },

    is_blocked: {
        type: Boolean,
        default: false
    },

    block_reason: {
        type: String,
    },

    is_available: {
        type: Boolean,
        default: true
    },

    // should allow payments to be made to
    phone_number: {
        type: String,
        required: true,
        unique: true
    },

    // password
    password: {
        type: String,
        required: true
    },

    // we want location and stuff but for now lets ignore this ( we will track it down the line )
}, { timestamps: true });

module.exports = mongoose.model('merchant', merchantSchema);