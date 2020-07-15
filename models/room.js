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
    typeOfSquad: {
        type: String,
        default: "Squad",
    },
    map: {
        type: String,
        default: "Erangel",
    },
    password: {
        type: String,
        required: true,
    },
});

module.exports = model('Room', roomSchema);