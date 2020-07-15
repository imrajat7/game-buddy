const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    pubgUsername: String,  
    referralCode: { 
        type: String, 
        required: true, 
    },
    referralCount: {
        type: Number,
        default: 0,
    },
    OTP: Number,
    OTPValidTill: {
        type: Date,
    },
});

module.exports = model('User', userSchema);