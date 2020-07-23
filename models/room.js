const { Schema, model } = require('mongoose');

const roomSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    mode: {
        type: String,
        default: "TPP",
    },
    matchType: String,
    typeOfSquad: {
        type: String,
        default: "Solo",
    },
    map: {
        type: String,
        default: "Erangel",
    },
    datetime: Date,
    entryFee: Number,
    killReward: Number,
    firstReward: String,
    secondReward: String,
});

module.exports = model('Room', roomSchema);