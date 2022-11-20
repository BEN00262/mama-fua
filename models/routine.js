const mongoose = require('mongoose');

// one routine per person
const routineSchema = new mongoose.Schema({
    // per day trigger ( on each trigger hit create an automatic job with the base routine location )
    // remind the guy 1 hr before actually fielding the job out 
    name: {
        type: String, // not really required defaults to routine-<when it was created>
        required: true // to be used during deletion or unpausing or pausing of the routine
    },

    // this adds to the cost of the job
    // if we prove this to be an actual need, add the ability to customize per timestamp
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

    // a customer can pause a routine
    is_paused: {
        type: Boolean,
        default: false
    },

    customer: {
        type: mongoose.Types.ObjectId,
        ref: 'customer'
    },

    // the timeline :)
    timestamps: [
        {
            type: String, // convert the time to crons
            required: true
        }
    ],

    location: { type: [Number], index: { type: '2dsphere', sparse: true}}
}, { timestamps: true });

module.exports = mongoose.model('routine', routineSchema);