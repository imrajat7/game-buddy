const { Schema, model } = require('mongoose');

// squad, no of matches, each match details, dates, entry fee, rewards, 

const tournamentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    numberOfMatches: Number,
    typeOfSquad: {
        type: String,
        default: "Squad",
    },
    matchType: { type: String },
    map: [{
        type: String,
        default: "Erangel",
    }],
    datetime: [{ type: Date }],
    prizePool: Number,
    entryFee: Number,
    killReward: String,
    firstReward: String,
    secondReward: String,
    thirdReward: String,
    fourthReward: String,
    fifthReward: String,
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
    messages: [
        { type: String }
    ],
    note: { type: String }
});

module.exports = model('Tournament', tournamentSchema);