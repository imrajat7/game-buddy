const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
    },
    pubgUsername : String,
});

module.exports = model('User', userSchema);