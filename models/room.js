const { Schema, model } = require('mongoose');

const roomSchema = new Schema({
    name: {
        type: String,
        required: true,
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
    minKills: {
        type: Number,
        default: 0,
    },
    killReward: Number,
    firstReward: String,
    secondReward: String,
    maxKillReward: String,
    teams: {
        type: Number,
        default: 100,
    },
    teamsJoined: {
        type: Number,
        default: 0,
    },
    players: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    note: {type : String}
});

module.exports = model('Room', roomSchema);